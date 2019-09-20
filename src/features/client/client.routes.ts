import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import {
    create,
    del,
    download,
    edit,
    getAll,
    getFields,
    rememberPassword,
    resetPassword,
    search,
    update,
    updatePassword,
    upload
} from './client.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('client')
    const router = new Router()

    router.get('', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), getAll)
    router.post('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), create)
    router.put('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), update)
    router.del('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), del)
    router.get('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), edit)
    router.post('/:id/upload', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT]), upload)
    router.get('/fields', checkAuthorized, checkRole([roles.MASTER]), getFields)
    router.get('/search', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), search)
    router.post('/remember/password', rememberPassword)
    router.patch('/reset/password', resetPassword)
    router.patch('/password', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT]), updatePassword)
    router.get('/download/:image', download)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
