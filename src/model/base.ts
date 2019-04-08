import uuid from 'uuid/v4'

export type UUID = string
export type ISO8601 = string

export function generateUUID(): UUID {
  return uuid()
}

export class BusinessLogicError extends Error {}
export class ValidationError extends BusinessLogicError {}