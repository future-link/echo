/* -----
  echo - Copyright (C) 2019 otofune

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 ----- */

import { build, Factoralize } from 'torikago'
import * as bcrypt from 'bcrypt'
import { Services, Repositories, Usecases } from './services'
import { Config } from './config'
import { userSignUp, userSignIn, userDoAuth } from './usecases'
import { createApp } from './app'

import { User } from './model/user'
import { MemMetadataRepository } from './repositoriesImpl/mem/metadata'
import { MemUserRepository } from './repositoriesImpl/mem/user'
import { MemPostRepository } from './repositoriesImpl/mem/post'
import { MemSessionRepository } from './repositoriesImpl/mem/session'

const round = 10

const config: Config = {
  version: '0.0.1',
}

const exampleUser = User.create({
  id: 'bdc2d099-f36f-4b67-ac20-676bb84f57d6',
  handle: 'example',
  name: null,
  hashedPassword: bcrypt.hashSync('password', round),
})

const examplePost = exampleUser.createPost({
  id: '1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b',
  text: 'Hello',
})

const repositories: Factoralize<Services, Repositories> = {
  metadataRepository: ({ config }) => new MemMetadataRepository(config),
  userRepository: () => new MemUserRepository([exampleUser]),
  postRepository: () => new MemPostRepository([examplePost]),
  sessionRepository: () => new MemSessionRepository([]),
}

const usecases: Factoralize<Services, Usecases> = {
  userSignUp,
  userSignIn,
  userDoAuth,
}

const services = build<Services>({
  config: () => config,
  hashPassword: () => pass => bcrypt.hash(pass, round),
  compareHash: () => (hash, password) => bcrypt.compare(password, hash),
  ...repositories,
  ...usecases,
})

const app = createApp(services).listen(3000)
