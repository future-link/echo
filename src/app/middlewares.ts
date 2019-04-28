import { join } from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { Middleware } from 'koa'
import { compile, Options, LocalsObject } from 'pug'

const readFile = promisify(fs.readFile)

type PugContextExtension = {
  render(name: string, locals?: LocalsObject): Promise<void>
}

export function usePug({ path: dirPath, pug }: { path: string, pug?: Options}): Middleware {
  return async (ctx, next) => {
    ctx.render = async (name: string, locals?: LocalsObject) => {
      const path = join(dirPath, `${name}.pug`)
      const templateSrc = await readFile(path, 'utf-8')
      const template = compile(templateSrc, {
        basedir: dirPath,
        ...pug
      })
      ctx.body = template(locals)
    }
    await next()
  }
}
