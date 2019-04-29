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
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { Services } from './services'
import { loadConfigFromEnv} from './config'
import { createApp } from './app'
import { createFactory } from './wire'

import { User } from './model/user'
import { MemUserRepository } from './repositoriesImpl/mem/user'
import { MemPostRepository } from './repositoriesImpl/mem/post'

dotenv.load()

const config = loadConfigFromEnv()

const exampleUser = User.create({
  id: 'bdc2d099-f36f-4b67-ac20-676bb84f57d6',
  handle: 'example',
  name: null,
  hashedPassword: bcrypt.hashSync('password', config.bcryptRound),
})

const examplePost = exampleUser.createPost({
  id: '1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b',
  text: 'Hello',
})

const services = build<Services>({
  ...createFactory(config),
  userRepository: () => new MemUserRepository([exampleUser]),
  postRepository: () => new MemPostRepository([examplePost])
})

createApp(services).listen(config.port)
