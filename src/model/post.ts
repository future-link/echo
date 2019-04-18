import { Entity, Reference, UUID, ValidationError } from './base'
import { UserRef } from './user'

export type Visibility = 'public'

export class PostRef implements Reference {
  readonly type = 'PostRef' as const
  constructor(readonly id: UUID) {}
}

export class Post implements Entity {
  readonly type = 'Post' as const
  readonly id: UUID
  readonly author: UserRef
  readonly createdAt: Date
  readonly text: string
  readonly visibility: Visibility

  constructor({
    id,
    author,
    createdAt,
    text,
    visibility,
  }: {
    id: UUID
    author: UserRef
    createdAt: Date
    text: string
    visibility: Visibility
  }) {
    this.id = id
    this.author = author
    this.createdAt = createdAt
    this.text = text
    this.visibility = visibility
  }

  public get ref(): PostRef {
    return new PostRef(this.id)
  }
}
