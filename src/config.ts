export type Config = {
  version: string
  port: number
  bcryptRound: number
  recaptcha?: {
    siteKey: string
    secretKey: string
  }
}

export function loadConfigFromEnv(): Config {
  if (!process.env.VERSION) throw '`version` is required'
  const version = process.env.VERSION

  const port = parseInt(process.env.PORT || '3000', 10)
  const bcryptRound = parseInt(process.env.BCRYPT_ROUND || '10', 10)

  const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY

  const recaptcha =
    recaptchaSiteKey && recaptchaSecretKey
      ? {
          siteKey: recaptchaSiteKey,
          secretKey: recaptchaSecretKey,
        }
      : undefined
  
  return {
    version,
    port,
    bcryptRound,
    recaptcha
  }
}
