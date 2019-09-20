import { environments } from '@constants/environments.const'

import { equals } from 'ramda'

const getDotEnvFile = (): string => {
    const { API_ENVIRONMENT = 'development' } = process.env
    if (equals(API_ENVIRONMENT, environments.production)) {
        return '.env'
    }
    return `.env.${API_ENVIRONMENT}`
}

export { getDotEnvFile }
