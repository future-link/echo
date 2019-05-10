import { Usecase } from './type'
import { User, BusinessLogicError } from '../model'

export type UserSignIn = (arg: { handle: string; password: string }) => Promise<User>

export const userSignIn: Usecase<UserSignIn> = ({ userRepository, compareHash }) => async ({ handle, password }) => {
  const user = await userRepository.fetchByHandle(handle)
  if (user == null) throw new BusinessLogicError('invalid handle or password')
  if (!(await compareHash(user.hashedPassword, password))) throw new BusinessLogicError('invalid handle or password')
  return user
}
