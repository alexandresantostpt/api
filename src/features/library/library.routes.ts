import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { create, del, download, getAll, getSingle, update, upload } from './library.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('library')
    const router = new Router()

    router.get('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), getAll)
    router.get('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), getSingle)
    router.post('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), create)
    router.put('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), update)
    router.del('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), del)
    router.post('/:id/upload', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), upload)
    router.get('/download/:image', download)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
