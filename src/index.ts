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
import * as dotenv from 'dotenv'
import { Services } from './services'
import { loadConfigFromEnv } from './config'
import { createApp } from './app'
import { createFactory } from './wire'

dotenv.config()

const config = loadConfigFromEnv()

const services = build<Services>({
  ...createFactory(config),
})

createApp(services).listen(config.port)
