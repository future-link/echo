import { Usecase } from './type'
import { User, BusinessLogicError } from '../model'

export type UserSignUp = (args: { handle: string; name: string | null, password: string }) => Promise<User>

export const userSignUp: Usecase<UserSignUp> = ({ userRepository, hashPassword }) => async ({ handle, name, password }) => {
  const hashedPassword = await hashPassword(password)
  const user = User.create({ handle, name, hashedPassword })
  if (await userRepository.fetchByHandle(handle) != null) {
    throw new BusinessLogicError('duplicate handle')
  }
  await userRepository.save(user)
  return user
}