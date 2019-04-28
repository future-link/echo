import { join } from 'path'
import Router from 'koa-router'
import { Services } from '../services'
import { ValidationError, BusinessLogicError } from '../model'
import { usePug } from './middlewares'
import { Context } from 'koa'

export function createWebRouter({ userDoAuth }: Services): Router {
  const viewPath = join(__dirname, '../../views')
  const router = new Router().use(usePug({ path: viewPath })).use(errorHandler)

  router.get('/auth/pauth', async ctx => {
    const redirectUrl: string | undefined = ctx.query.redirect_url
    if (redirectUrl == null) throw new ValidationError('redirect_url is required')
    const url = new URL(redirectUrl)
    await ctx.render('auth', { domain: url.host, redirect_url: redirectUrl })
  })

  router.post('/auth/pauth', async ctx => {
    const redirectUrlString: string | undefined = ctx.query.redirect_url
    const handle: string | undefined = ctx.request.body.handle
    const password: string | undefined = ctx.request.body.password

    if (redirectUrlString == null) throw new ValidationError('redirect_url is required')
    if (handle == null) throw new ValidationError('handle is required')
    if (password == null) throw new ValidationError('password is required')

    const redirectUrl = new URL(redirectUrlString)
    const session = await userDoAuth({ handle, password, redirectUrl })
    redirectUrl.hash = `token=${session.id}`
    ctx.redirect(redirectUrl.toJSON())
  })

  return router
}

async function errorHandler(ctx: Context, next: () => Promise<void>): Promise<void> {
  try {
    await next()
  } catch (err) {
    if (err instanceof BusinessLogicError) {
      ctx.status = 400
      ctx.body = err.message
    } else {
      ctx.status = 500
      ctx.body = 'Internal Server Error'
      console.error(err)
    }
  }
}
