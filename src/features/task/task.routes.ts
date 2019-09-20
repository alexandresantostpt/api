import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { create, del, edit, getAll, getFields, update } from './task.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('task')
    const router = new Router()

    router.get('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT, roles.MASTER]), getAll)
    router.post('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT, roles.MASTER]), create)
    router.put('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT, roles.MASTER]), update)
    router.del('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT, roles.MASTER]), del)
    router.get('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT, roles.MASTER]), edit)
    router.get('/fields', checkAuthorized, checkRole([roles.MASTER]), getFields)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
