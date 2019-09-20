import { mocks } from '@/constants/mocks.const'

import * as errors from 'restify-errors'

import { Request, Response, Next } from 'restify'

import { crud } from '@utils/database.utils'
import { handleError } from '@/utils/api.utils'

import Agency from './agency.schema'

const { create, del, download, edit, getFields, update, upload } = crud(Agency)

const getAll = async (req: Request, res: Response, next: Next) => {
    try {
        res.send(await Agency.find({ deleted: false, socialName: { $ne: mocks.DEXTRA_AGENCY_NAME } }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { create, del, download, edit, getAll, getFields, update, upload }
