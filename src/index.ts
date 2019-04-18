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

import { build } from 'torikago'
import { Services } from './services'
import { Config } from './config'
import { createApp } from './app'

import { User } from './model/user'
import { MemMetadataRepository } from './repositoryImpl/mem/metadata'
import { MemUserRepository } from './repositoryImpl/mem/user'
import { MemPostRepository } from './repositoryImpl/mem/post'

const config: Config = {
  version: '0.0.1',
}

const exampleUser = User.create({
  id: 'bdc2d099-f36f-4b67-ac20-676bb84f57d6',
  handle: 'example',
  name: null,
})

const examplePost = exampleUser.createPost({
  id: '1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b',
  text: 'Hello',
})

const services = build<Services>({
  config: () => config,
  metadataRepository: ({ config }) => new MemMetadataRepository(config),
  userRepository: () => new MemUserRepository([exampleUser]),
  postRepository: () => new MemPostRepository([examplePost]),
})

const app = createApp(services).listen(3000)
