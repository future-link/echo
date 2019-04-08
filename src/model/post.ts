import { UUID, ValidationError } from './base'
import { UserRef } from './user'

export type Visibility = 'public'

export class PostRef {
  readonly _type = 'Post' as const
  constructor(readonly id: UUID) {}
}

export class Post {
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

  toJson(): any {
    return {
      id: this.id,
      author: this.author.id,
      createdAt: this.createdAt.toISOString(),
      text: this.text,
      visibility: this.visibility,
    }
  }
}
