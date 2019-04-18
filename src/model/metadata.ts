import { Model, ValidationError } from './base'

const semverReg = /^\d+\.\d+\.\d+$/

// IndexResource
export class Metadata implements Model {
  readonly type = 'Metadata'
  readonly version: string

  constructor({ version }: { version: string }) {
    if (!semverReg.test(version)) throw new ValidationError('"version" must be a semver.')
    this.version = version
  }
}