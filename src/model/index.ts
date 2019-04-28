export { Entity, UUID } from './base'
export { BusinessLogicError, ValidationError, NotFoundError } from './errors'
export { Metadata } from './metadata'
export { User, UserRef } from './user'
export { Post, PostRef } from './post'
export { Session, SessionRef } from './session'

import { Metadata } from './metadata'
import { User, UserRef } from './user'
import { Post, PostRef} from './post'
import { Session, SessionRef } from './session'

export type Model = Metadata | User | Post | Session
export type Reference = UserRef | PostRef | SessionRef