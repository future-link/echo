import { Context } from 'koa'
import Router from 'koa-router'
import { Services } from '../services'
import { UserRef, PostRef, NotFoundError, BusinessLogicError } from '../model'
import { modelToJson } from './presenter'
import { requireAuth as requireAuthMiddleware } from './middlewares'

export function createApiRouter({ metadataRepository, userRepository, postRepository, sessionRepository }: Services): Router {
  const router = new Router()
  router.use(errorHandler)

  const requireAuth = requireAuthMiddleware(sessionRepository)

  router.get('/', async ctx => {
    ctx.body = modelToJson(await metadataRepository.fetchMetadata())
  })

  router.get('/users/:id',requireAuth, async ctx => {
    const ref = new UserRef(ctx.params.id)
    ctx.body = modelToJson(await userRepository.fetchByRef(ref))
  })

  router.get('/posts/:id', requireAuth, async ctx => {
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
    } if(err.status) {
      ctx.status = err.status
      message = err.message || 'something happened'
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