import { Usecase } from './type'
import { User, BusinessLogicError, Session } from '../model'

export type UserDoAuth = (args: { handle: string, password: string, redirectUrl: URL }) => Promise<Session>

export const userDoAuth: Usecase<UserDoAuth> = ({ userSignIn, sessionRepository }) => async ({ handle, password, redirectUrl }) => {
  const user = await userSignIn({ handle, password })
  const session = user.createSession({ client: redirectUrl.host })
  await sessionRepository.save(session)
  return session
}