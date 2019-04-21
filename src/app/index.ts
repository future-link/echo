import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { modelToJson } from './presenter'
import { UserRef, NotFoundError, BusinessLogicError, PostRef } from '../model'
import { Services } from '../services'

export function createApp({ metadataRepository, userRepository, postRepository, createUser }: Services): Koa {
  const app = new Koa()
  const router = new Router()

  router.get('/api/', async ctx => {
    ctx.body = modelToJson(await metadataRepository.fetchMetadata())
  })

  router.get('/api/users/:id', async ctx => {
    const ref = new UserRef(ctx.params.id)
    ctx.body = modelToJson(await userRepository.fetchByRef(ref))
  })

  router.get('/api/posts/:id', async ctx => {
    const ref = new PostRef(ctx.params.id)
    ctx.body = modelToJson(await postRepository.fetchByRef(ref))
  })

  router.all('/api/(.*)', async () => {
    throw new NotFoundError('wrong path or method')
  })

  app
    .use(errorHandler)
    .use(bodyParser({
      detectJSON(ctx) {
        return /^{.+}$/.test(ctx.request.body)
      }
    }))
    .use(router.routes())
    .use(router.allowedMethods())
  return app
}

async function errorHandler(ctx: Koa.Context, next: () => Promise<unknown>): Promise<void> {
  try {
    await next()
    ctx.body = {
      result: ctx.body,
    }
  } catch (err) {
    let message: string
    if (err instanceof NotFoundError) {
      ctx.status = 404
      message = err.message
    } else if (err instanceof BusinessLogicError) {
      ctx.status = 400
      message = err.message
    } else {
      ctx.status = 500
      message = 'something happened'
      console.error(err)
    }

    ctx.body = {
      result: {},
      errors: [{ message }]
    }
  }
}
