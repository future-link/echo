import { Factoralize } from 'torikago'
import * as bcrypt from 'bcrypt'
import { Services, Repositories, Usecases } from './services'
import { Config } from './config'
import { userSignUp, userSignIn, userDoAuth } from './usecases'

import {
  MemMetadataRepository,
  MemPostRepository,
  MemSessionRepository,
  MemUserRepository,
} from './repositoriesImpl/mem'

export function createFactory(config: Config): Factoralize<Services, Services> {
  const repositories = createRepositoryFactory(config)

  const usecases: Factoralize<Services, Usecases> = {
    userSignUp,
    userSignIn,
    userDoAuth,
  }

  return {
    config: () => config,
    hashPassword: ({ config: { bcryptRounds } }) => pass => bcrypt.hash(pass, bcryptRounds),
    compareHash: () => (hash, password) => bcrypt.compare(password, hash),
    ...repositories,
    ...usecases,
  }
}

function createRepositoryFactory(config: Config): Factoralize<Services, Repositories> {
  return {
    metadataRepository: ({ config }) => new MemMetadataRepository(config),
    userRepository: () => new MemUserRepository([]),
    postRepository: () => new MemPostRepository([]),
    sessionRepository: () => new MemSessionRepository([]),
  }
}
