import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import {
    getFields,
    popLibraryFromTipService,
    pushLibraryToTipService,
    putService,
    removeService,
    updateCity
} from './travelScript.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('travel/script')
    const router = new Router()

    router.patch('/:scriptId/date', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), updateCity)
    router.post('/tip/library', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), pushLibraryToTipService)
    router.del('/tip/library', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), popLibraryFromTipService)
    router.put('/service', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), putService)
    router.del('/service', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), removeService)
    router.get('/fields', checkAuthorized, checkRole([roles.MASTER]), getFields)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
