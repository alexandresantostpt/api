import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { create, del, download, edit, getAll, getFields, update, upload } from './tour.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('tour')
    const router = new Router()

    router.get('', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), getAll)
    router.post('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), create)
    router.put('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), update)
    router.del('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), del)
    router.get('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), edit)
    router.post('/:id/upload', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), upload)
    router.get('/fields', checkAuthorized, checkRole([roles.MASTER]), getFields)
    router.get('/download/:image', download)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
