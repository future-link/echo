import { User, UserRef } from '../model/user'

export interface UserRepository {
  fetchByRef(ref: UserRef): Promise<User | null>
  fetchByRefs(refs: UserRef[]): Promise<Array<User | null>>
}