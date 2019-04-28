import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { Services } from '../services'
import { createApiRouter } from './apiRouter'
import { createWebRouter } from './webRouter'

export function createApp(services: Services): Koa {
  const app = new Koa()
  const router = new Router()
  const apiRouter = createApiRouter(services)
  const webRouter = createWebRouter(services)

  router.use('/api/v1', apiRouter.routes(), apiRouter.allowedMethods())
  router.use('', webRouter.routes(), webRouter.allowedMethods())

  app
    .use(bodyParser({
      detectJSON(ctx) {
        return /^{.+}$/.test(ctx.request.body)
      }
    }))
    .use(router.routes())
    .use(router.allowedMethods())
  return app
}
