import { join } from 'path'
import { Context } from 'koa'
import Router from 'koa-router'
import { Services } from '../services'
import { ValidationError, BusinessLogicError } from '../model'
import { usePug, verifyWithRecaptcha, nullMiddleware } from './middlewares'

export function createWebRouter({ config, userSignUp, userDoAuth }: Services): Router {
  const viewPath = join(__dirname, '../../views')
  const router = new Router().use(usePug({ path: viewPath })).use(errorHandler)

  const recaptchaSiteKey = config.recaptcha && config.recaptcha.siteKey
  const recaptchaSecretKey = config.recaptcha && config.recaptcha.secretKey

  const recaptcha = recaptchaSecretKey ? verifyWithRecaptcha(recaptchaSecretKey) : nullMiddleware

  router.get('/auth/signup', async ctx => {
    await ctx.render('signup', { recaptchaSiteKey })
  })

  router.post('/auth/signup', recaptcha, async ctx => {
    const handle: string | undefined = ctx.request.body.handle
    const name: string | null = ctx.request.body.name || null
    const password: string | undefined = ctx.request.body.password

    if (handle == null) throw new ValidationError('handle is required')
    if (password == null) throw new ValidationError('password is required')

    await userSignUp({ handle, name, password })

    ctx.redirect('/auth/settings')
  })

  router.get('/auth/pauth', async ctx => {
    const redirectUrl: string | undefined = ctx.query.redirect_url
    if (redirectUrl == null) throw new ValidationError('redirect_url is required')
    const url = new URL(redirectUrl)
    await ctx.render('auth', { domain: url.host, recaptchaSiteKey })
  })

  router.post('/auth/pauth', recaptcha, async ctx => {
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

  router.get('/auth/settings', ctx => ctx.render('settings'))

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
