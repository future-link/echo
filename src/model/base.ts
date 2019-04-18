export { BusinessLogicError, ValidationError, NotFoundError } from './errors'
import uuid from 'uuid/v4'

export interface Model {
  readonly type: string
}

export interface Entity extends Model {
  readonly id: UUID
  readonly ref: Reference
}

export interface Reference {
  readonly type: string
  readonly id: UUID
}

export type UUID = string
export type ISO8601 = string

export function generateUUID(): UUID {
  return uuid()
}
