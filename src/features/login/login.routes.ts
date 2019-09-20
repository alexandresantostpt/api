import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { authAgency, authMobile, authPlatform, getAgencies } from './login.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('login')
    const router = new Router()

    router.get('/auth/agencies', checkAuthorized, checkRole([roles.CLIENT]), getAgencies)
    router.post('/auth/mobile', authMobile)
    router.post('/auth/mobile/agency', checkAuthorized, checkRole([roles.CLIENT]), authAgency)
    router.post('/auth/platform', authPlatform)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
