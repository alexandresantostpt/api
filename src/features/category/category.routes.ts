import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { create, del, edit, getAll, getFields, update } from './category.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('category')
    const router = new Router()

    router.get('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), getAll)
    router.post('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), create)
    router.put('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), update)
    router.del('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), del)
    router.get('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), edit)
    router.get('/fields', checkAuthorized, checkRole([roles.MASTER]), getFields)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
