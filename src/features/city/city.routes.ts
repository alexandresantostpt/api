import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { save, search, searchGoogle } from './city.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('city')
    const router = new Router()

    router.get('/search', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), search)
    router.get('/google/search', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), searchGoogle)
    router.post('/google', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), save)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
