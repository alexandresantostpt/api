import { services } from '@/constants/services.const'

import * as errors from 'restify-errors'

import { Request, Response, Next } from 'restify'

import { crud } from '@utils/database.utils'
import { handleError } from '@/utils/api.utils'

import ProgrammingService from './programmingService.schema'

const { create, del, edit, getFields, update, upload } = crud(ProgrammingService)

const getAll = async (req: Request, res: Response, next: Next) => {
    try {
        res.send(await ProgrammingService.find({ deleted: false, type: services.PROGRAMMING }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { create, del, edit, getAll, getFields, update, upload }
