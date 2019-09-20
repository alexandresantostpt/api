import { config } from 'dotenv'

import { getDotEnvFile } from '@utils/env.utils'

import EnvType from '@/types/env.type'

const load = (cb: Function): EnvType => {
    config({ path: getDotEnvFile() })
    return cb()
}

export { load }
