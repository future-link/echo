import { UUID, generateUUID, ValidationError } from './base'
import { Post, Visibility } from './post'

export class UserRef {
  readonly _type = 'User' as const
  constructor(readonly id: UUID) {}
}
export class User {
  readonly id: UUID
  readonly handle: string
  readonly name: string | null

  constructor({ id, handle, name }: { id: UUID; handle: string; name: string | null }) {
    this.id = id
    this.handle = validateHandleName(handle)
    this.name = validateName(name)
  }

  get ref(): UserRef {
    return new UserRef(this.id)
  }

  toJson(): any {
    return {
      id: this.id,
      handle: this.handle,
      name: this.name,
    }
  }

  static create({ handle, name }: { handle: string; name?: string | null }): User {
    return new User({
      id: generateUUID(),
      handle,
      name: name || null
    })
  }

  updateName(newName: string): User {
    return new User({
      ...this,
      name: newName,
    })
  }

  createPost({ text, visibility }: { text: string; visibility?: Visibility}): Post {
    return new Post({
      id: generateUUID(),
      author: this.ref,
      createdAt: new Date(),
      text,
      visibility: visibility || 'public'
    })
  }
}

function validateHandleName(handle: string): string {
  if (!/^[a-z0-9\-]*$/.test(handle)) throw new ValidationError('Each "handle" characters must be a-z, 0-9, and "-"')
  const length = handle.length
  if (length < 3 || 15 < length)
    throw new ValidationError('"handle" must be at least 3 characters and not more than 15 characters')
  return handle
}

function validateName(name: string | null): string | null {
  if (name == null) return name
  return name
}
