import { UUID, User, UserRef } from '../../model'
import { UserRepository } from '../../repositories/user'

export class MemUserRepository implements UserRepository {
  private users: Map<UUID, User>

  constructor(users: User[]) {
    this.users = new Map(users.map(user => [user.id, user]))
  }

  async fetchByRef(ref: UserRef): Promise<User | null> {
    return this.users.get(ref.id) || null
  }

  fetchByRefs(refs: UserRef[]): Promise<Array<User | null>> {
    return Promise.all(refs.map(ref => this.fetchByRef(ref)))
  }

  async fetchByHandle(handle: string): Promise<User | null> {
    for(const user of this.users.values()) {
      if (user.handle === handle) return user
    }
    return null
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user)
  }
}