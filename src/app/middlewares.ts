import { join } from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { Middleware, Context } from 'koa'
import { compile, Options, LocalsObject, compileTemplate } from 'pug'
import fetch from 'node-fetch'
import { ValidationError, User, Session, SessionRef, UserRef } from '../model'
import { SessionRepository } from '../repositories'

const readFile = promisify(fs.readFile)

export function usePug({ path: dirPath, pug }: { path: string; pug?: Options }): Middleware {
  return async (ctx, next) => {
    const templateCache: Map<string, compileTemplate> = new Map()

    async function getTemplate(name: string): Promise<compileTemplate> {
      if (process.env.NODE_ENV === 'production' && templateCache.has(name)) return templateCache.get(name)!
      const path = join(dirPath, `${name}.pug`)
      const templateSrc = await readFile(path, 'utf-8')
      const template = compile(templateSrc, {
        basedir: dirPath,
        ...pug,
      })
      templateCache.set(name, template)
      return template
    }

    ctx.render = async (name: string, locals?: LocalsObject) => {
      const template = await getTemplate(name)
      ctx.body = template(locals)
    }
    await next()
  }
}

export async function nullMiddleware(ctx: Context, next: () => Promise<void>): Promise<void> {
  await next()
}

export function verifyWithRecaptcha(secretKey: string): Middleware {
  return async (ctx, next) => {
    const recaptchaResponse: string | undefined = ctx.request.body['g-recaptcha-response']
    if (recaptchaResponse == null) throw new ValidationError('reCAPTCHA is required')

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: secretKey,
        response: recaptchaResponse,
      }),
    }).then(r => r.json())
    if (!res.success) {
      console.log(res)
      throw new ValidationError('Fail to verify with reCAPTCHA')
    }

    await next()
  }
}

export function requireAuth(sessionRepository: SessionRepository): Middleware<any, { userRef: UserRef }> {
  return async (ctx, next) => {
    const auth: string | undefined = ctx.headers.authorization
    if (auth == null) {
      ctx.throw(401, 'Authorization header is required')
      throw 'unreachable'
    }

    const [schema, token] = auth.split(/\s+/, 2)
    if (schema !== 'Bearer') {
      ctx.throw(401, 'Authorization Scheme must be `Bearer')
      throw 'unreachable'
    }
    if (token == null) {
      ctx.throw(401, 'Invalid Auth Header')
      throw 'unreachable'
    }

    console.log(token)

    const session = await sessionRepository.fetchByRef(new SessionRef(token))
    if (session == null) {
      ctx.throw(401, 'Invalid token')
      throw 'unreachable'
    }

    ctx.userRef = session.user
    await next()
  }
}
