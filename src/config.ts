export type Config = {
  version: string,
  port: number,
  bcryptRounds: number,
  recaptcha?: {
    siteKey: string,
    secretKey: string
  }
}
