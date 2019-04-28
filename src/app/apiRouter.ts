import { Context } from 'koa'
import Router from 'koa-router'
import { Services } from '../services'
import { modelToJson } from './presenter'
import { UserRef, PostRef, NotFoundError, BusinessLogicError } from '../model';

export function createApiRouter({ metadataRepository, userRepository, postRepository }: Services): Router {
  const router = new Router()
  router.use(errorHandler)

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

  router.all('/api/(.*)', async () => {
    throw new NotFoundError('not found')
  })

  return router
}

async function errorHandler(ctx: Context, next: () => Promise<unknown>): Promise<void> {
  try {
    await next()
    ctx.body = {
      result: ctx.body
    }
  } catch(err) {
    let message: string
    if(err instanceof NotFoundError) {
      ctx.status = 404
      message = err.message
    } else if(err instanceof BusinessLogicError) {
      ctx.status = 400
      message = err.message
    } else {
      ctx.status = 500
      message = 'something happened'
      // TODO: まともなエラーログ
      console.error(err)
    }

    ctx.body = {
      result: {},
      errors: [{ message }]
    }
  }
}