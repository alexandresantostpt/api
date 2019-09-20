import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { create, del, edit, getAll, update } from './agencyUser.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('agency-user')
    const router = new Router()

    router.get('', checkAuthorized, checkRole([roles.MASTER]), getAll)
    router.post('', checkAuthorized, checkRole([roles.MASTER]), create)
    router.put('', checkAuthorized, checkRole([roles.MASTER]), update)
    router.del('', checkAuthorized, checkRole([roles.MASTER]), del)
    router.get('/:agencyId/:userId', checkAuthorized, checkRole([roles.ADMIN, roles.MASTER]), edit)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
