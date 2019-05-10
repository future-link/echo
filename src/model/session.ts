import { Entity, Reference, generateUUID, UUID } from './base'
import { UserRef } from './user'

export class SessionRef implements Reference {
  readonly type = 'SessionRef' as const
  constructor(readonly id: UUID) {}
}

export class Session implements Entity {
  readonly type = 'Session' as const
  readonly id: UUID
  readonly user: UserRef
  readonly client: string // domain
  readonly createdAt: Date

  constructor({ id, user, client, createdAt }: { id: UUID; user: UserRef; client: string; createdAt: Date }) {
    this.id = id
    this.user = user
    this.client = client
    this.createdAt = createdAt
  }

  get ref() {
    return new SessionRef(this.id)
  }

  static create({ user, client }: { user: UserRef; client: string }): Session {
    return new Session({
      id: generateUUID(),
      user,
      client,
      createdAt: new Date(),
    })
  }
}
