import { UUID, User, UserRef } from '../../model'
import { UserRepository } from '../../repository/user'

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
}