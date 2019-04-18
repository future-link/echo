import Koa from 'koa'
import Router from 'koa-router'
import { modelToJson } from './presenter'
import { UserRef, NotFoundError, BusinessLogicError, PostRef } from '../model'
import { Services } from '../services'

export function createApp({ metadataRepository, userRepository, postRepository }: Services): Koa {
  const app = new Koa()
  const router = new Router()

  router.get('/', async ctx => {
    ctx.body = modelToJson(await metadataRepository.fetchMetadata())
  })

  router.get('/users/:id', async ctx => {
    const ref = new UserRef(ctx.params.id)
    ctx.body = modelToJson(await userRepository.fetchByRef(ref))
  })

  router.get('/posts/:id', async ctx => {
    const ref = new PostRef(ctx.params.id)
    ctx.body = modelToJson(await postRepository.fetchByRef(ref))
  })

  router.all('/(.*)', async () => {
    throw new NotFoundError('wrong path or method')
  })

  app
    .use(errorHandler)
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
    if (err instanceof NotFoundError) {
      ctx.status = 404
    } else if (err instanceof BusinessLogicError) {
      ctx.status = 400
    } else {
      ctx.status = 500
    }

    const message = err.message || 'something happened'   

    ctx.body = {
      result: {},
      errors: [{ message }]
    }
  }
}
