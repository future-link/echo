import { Factoralize } from 'torikago'
import * as bcrypt from 'bcrypt'
import { Firestore } from '@google-cloud/firestore'
import { Services, Repositories, Usecases, Database } from './services'
import { Config } from './config'
import { userSignUp, userSignIn, userDoAuth, userCreatePost } from './usecases'

import {
  MemMetadataRepository,
  MemPostRepository,
  MemSessionRepository,
  MemUserRepository,
} from './repositoriesImpl/mem'
import { FirestoreUserRepository, FirestorePostRepository, FirestoreSessionRepository } from './repositoriesImpl/firestore'

export function createFactory(config: Config): Factoralize<Services, Services> {
  const database = createDatabase(config)
  const repositories = createRepositoryFactory(config)

  const usecases: Factoralize<Services, Usecases> = {
    userSignUp,
    userSignIn,
    userDoAuth,
    userCreatePost,
  }

  return {
    db: () => database,
    config: () => config,
    hashPassword: ({ config: { bcryptRound } }) => pass => bcrypt.hash(pass, bcryptRound),
    compareHash: () => (hash, password) => bcrypt.compare(password, hash),
    ...repositories,
    ...usecases,
  }
}

function createDatabase(config: Config): Database {
  const dbconf = config.database
  switch (dbconf.type) {
    case 'mem':
      return { type: 'mem' }
    case 'firestore':
      const db = new Firestore()
      return { type: 'firestore', instance: db }
  }
}

function createRepositoryFactory(config: Config): Factoralize<Services, Repositories> {
  switch (config.database.type) {
    case 'mem':
      return {
        metadataRepository: ({ config }) => new MemMetadataRepository(config),
        userRepository: () => new MemUserRepository([]),
        postRepository: () => new MemPostRepository([]),
        sessionRepository: () => new MemSessionRepository([]),
      }
    case 'firestore':
      return {
        metadataRepository: ({ config }) => new MemMetadataRepository(config),
        userRepository: ({ db }) => new FirestoreUserRepository(getFirestore(db)),
        postRepository: ({ db }) => new FirestorePostRepository(getFirestore(db)),
        sessionRepository: ({ db }) => new FirestoreSessionRepository(getFirestore(db))
      }
  }
}

function getFirestore(db: Database): Firestore {
  if (db.type !== 'firestore') throw 'fatal:db is not firestore'
  return db.instance
}
