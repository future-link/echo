import { User, UserRef } from '../model/user'

export interface UserRepository {
  fetchByRef(ref: UserRef): Promise<User | null>
  fetchByRefs(refs: UserRef[]): Promise<Array<User | null>>
  fetchByHandle(handle: string): Promise<User | null>
  save(user: User): Promise<void>
}