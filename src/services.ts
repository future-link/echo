import { Config } from './config'
import { MetadataRepository, UserRepository, PostRepository } from './repository'

export type Services = Readonly<{
  config: Config
  metadataRepository: MetadataRepository
  userRepository: UserRepository
  postRepository: PostRepository
}>

export type DependentTo<Keys extends keyof Services> = Pick<Services, Keys>
