import { environments } from '@constants/environments.const'

import * as configs from '@env/index.env'

import EnvType from '@/types/env.type'

const environment: string = process.env.API_ENVIRONMENT || environments.development
const config: EnvType = configs[environment]

export { config }
