import { Config } from './config'
import { MetadataRepository, UserRepository, PostRepository } from './repositories'
import { CreateUser } from './usecases'

export type Repositories = Readonly<{
  metadataRepository: MetadataRepository
  userRepository: UserRepository
  postRepository: PostRepository
}>

export type Usecases = Readonly<{
  createUser: CreateUser
}>

export type Services = Readonly<{
  config: Config
  hashPassword: (password: string) => Promise<string>
}> & Repositories & Usecases

export type DependentTo<Keys extends keyof Services> = Pick<Services, Keys>
