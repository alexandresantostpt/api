import { roles } from '@features/user/constants'

import { Router } from 'restify-router'
import { Server } from 'restify'

import { checkAuthorized, checkRole } from '@utils/auth.utils'
import { createUrlContext } from '@utils/api.utils'

import {
    archive,
    close,
    create,
    del,
    download,
    edit,
    getAll,
    getAllArchived,
    getFields,
    share,
    unarchive,
    unshare,
    update,
    updateMaterial,
    upload
} from './travel.controller'

import { getScript, getScriptToClients } from '@features/travelScript/travelScript.controller'

const routes = (server: Server): Router => {
    const contextPrefix = createUrlContext('travel')
    const router = new Router()

    router.get('', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), getAll)
    router.get('/archiveds', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), getAllArchived)
    router.post('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), create)
    router.put('', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), update)
    router.del('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), del)
    router.get('/:id', checkAuthorized, checkRole([roles.ADMIN, roles.CLIENT, roles.CONSULTANT]), edit)
    router.get('/:id/script', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), getScript)
    router.get('/:id/scriptToClient', checkAuthorized, checkRole([roles.CLIENT]), getScriptToClients)
    router.patch('/:id/archive', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), archive)
    router.patch('/:id/unarchive', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), unarchive)
    router.post('/:id/close', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), close)
    router.post('/:id/share', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), share)
    router.post('/:id/unshare', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), unshare)
    router.patch('/:id/updateMaterial', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), updateMaterial)
    router.post('/:id/upload', checkAuthorized, checkRole([roles.ADMIN, roles.CONSULTANT]), upload)
    router.get('/fields', checkAuthorized, checkRole([roles.MASTER]), getFields)
    router.get('/download/:image', download)

    router.applyRoutes(server, contextPrefix)
    return router
}

export { routes }
