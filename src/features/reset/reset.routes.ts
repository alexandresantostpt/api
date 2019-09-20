import { environments } from '@/constants/environments.const'
import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { config } from '@config/config'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { reset } from './reset.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('reset')
    const router = new Router()

    if (config.api.environment === environments.development) {
        router.post('', checkAuthorized, checkRole([roles.MASTER]), reset)
        router.applyRoutes(server, contextPrefix)
    }

    return router
}

export { routes }
