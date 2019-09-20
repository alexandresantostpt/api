import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import { del, getAllRead, getAllUnread, getFields, read } from './notification.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('notification')
    const router = new Router()

    router.get('/read', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), getAllRead)
    router.get('/fields', checkAuthorized, checkRole([roles.MASTER]), getFields)
    router.get('/unread', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), getAllUnread)
    router.patch('/read', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), read)
    router.del('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), del)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
