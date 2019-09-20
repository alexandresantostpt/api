import { environments } from '@/constants/environments.const'

import { config as defaultConfig } from './default.env'

import EnvType from '@/types/env.type'

const config: EnvType = { ...defaultConfig() }

config.api.environment = environments.production
config.app.url = 'http://tpt-homolog.dextra.tech'

export { config }
