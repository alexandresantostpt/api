import * as errors from 'restify-errors'

import { Request, Response, Next } from 'restify'

import { crud } from '@utils/database.utils'
import { getToken, getUserId } from '@/utils/auth.utils'
import { handleError } from '@/utils/api.utils'

import Task from './task.schema'

const { create, del, edit, getFields, update } = crud(Task)

const getAll = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        res.send(await Task.find({ deleted: false, user: getUserId(token) }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { create, del, edit, getAll, getFields, update }
