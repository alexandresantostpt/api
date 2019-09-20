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
    update,
    updatePassword,
    upload
} from './user.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('user')
    const router = new Router()

    router.get('', checkAuthorized, checkRole([roles.ADMIN]), getAll)
    router.post('', checkAuthorized, checkRole([roles.ADMIN]), create)
    router.put('', checkAuthorized, checkRole([roles.ADMIN]), update)
    router.del('/:id', checkAuthorized, checkRole([roles.ADMIN]), del)
    router.get('/:id', checkAuthorized, checkRole([roles.ADMIN]), edit)
    router.post('/:id/upload', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), upload)
    router.get('/fields', checkAuthorized, checkRole([roles.ADMIN]), getFields)
    router.post('/remember/password', rememberPassword)
    router.patch('/reset/password', resetPassword)
    router.patch('/password', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT, roles.MASTER]), updatePassword)
    router.get('/download/:image', download)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
