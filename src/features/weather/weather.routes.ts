import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { getFiveDaysInfo } from './weather.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('weather')
    const router = new Router()

    router.get('/five-days-info', checkAuthorized, checkRole([roles.CLIENT]), getFiveDaysInfo)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
