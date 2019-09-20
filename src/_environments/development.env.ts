import { config as defaultConfig } from './default.env'

import EnvType from '@/types/env.type'

const config: EnvType = { ...defaultConfig() }

export { config }
