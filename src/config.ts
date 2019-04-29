export type Config = {
  version: string,
  recaptcha?: {
    siteKey: string,
    secretKey: string
  }
}
