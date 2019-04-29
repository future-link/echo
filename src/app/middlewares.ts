import { join } from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { Middleware, Context } from 'koa'
import { compile, Options, LocalsObject, compileTemplate } from 'pug'
import fetch from 'node-fetch'
import { ValidationError } from '../model'

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
        ...pug
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
