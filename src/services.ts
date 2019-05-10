import { Config } from './config'
import { MetadataRepository, UserRepository, PostRepository, SessionRepository } from './repositories'
import { UserSignUp, UserDoAuth, UserSignIn, UserCreatePost } from './usecases'
import { Firestore } from '@google-cloud/firestore'

export type Database =
  | {
      type: 'mem'
    }
  | {
      type: 'firestore'
      instance: Firestore
    }

export type Repositories = Readonly<{
  metadataRepository: MetadataRepository
  userRepository: UserRepository
  postRepository: PostRepository
  sessionRepository: SessionRepository
}>

export type Usecases = Readonly<{
  userSignUp: UserSignUp
  userSignIn: UserSignIn
  userDoAuth: UserDoAuth
  userCreatePost: UserCreatePost
}>

export type Services = Readonly<{
  config: Config
  hashPassword: (password: string) => Promise<string>
  compareHash: (hash: string, password: string) => Promise<boolean>
  db: Database
}> &
  Repositories &
  Usecases

export type DependentTo<Keys extends keyof Services> = Pick<Services, Keys>
