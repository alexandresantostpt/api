import * as errors from 'restify-errors'
import * as mongoose from 'mongoose'

import { Request, Response, Next } from 'restify'

import { getToken, getAgencyId } from '@utils/auth.utils'
import { handleError } from '@utils/api.utils'
import { libraries } from '@constants/libraries.const'

import { crud } from '@/utils/database.utils'

import Library from './library.schema'
import LibraryFactory from '../library/library.factory'

const NOT_FOUND_MESSAGE = 'No library found with the specified id'

const { download, upload } = crud(Library)

const findOptions = { context: 'query', new: true }

const create = async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const { type, ...library } = req.body
        const token = getToken(req)
        const agency = getAgencyId(token)
        const model = LibraryFactory.get(type)
        res.send(await model.create({ ...library, _by: token, agency }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const del = async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const { id } = req.params
        const token = getToken(req)

        const where = { _id: id, deleted: false }
        const data = { $set: { _by: token, deleted: true } }
        const library = await Library.findOneAndUpdate(where, data, findOptions).lean()

        if (library) {
            res.send(library)
        } else {
            res.send(new errors.NotFoundError(NOT_FOUND_MESSAGE))
        }

        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

/**
 * Get all Libraries
 * @param cityId
 * @param libraryName
 * @param type
 */
const getAll = async (req: Request, res: Response, next: Next) => {
    try {
        const { cityId, libraryName, type } = req.query
        const token = getToken(req)
        const where: any = {
            agency: mongoose.Types.ObjectId(getAgencyId(token)),
            deleted: false,
            type: type ? type : { $in: [libraries.HOTEL, libraries.TIP, libraries.TOUR] }
        }

        if (cityId) {
            where['city.id'] = cityId
        }

        if (libraryName) {
            where.name = { $regex: new RegExp(`^${libraryName}`, 'i') }
        }

        res.send(await Library.find(where).lean())
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const getSingle = async (req: Request, res: Response, next: Next) => {
    try {
        const { id: _id } = req.params
        const token = getToken(req)
        const library = await Library.findOne({ _id, agency: getAgencyId(token), deleted: false }).lean()

        if (library) {
            res.send(library)
        } else {
            res.send(new errors.NotFoundError(NOT_FOUND_MESSAGE))
        }

        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

/**
 * This method is used for TravelScriptService
 * @param libraryData
 * @param type
 * @param token
 * @param city
 */
const save = async (libraryData: any, type: libraries, token: String, city: any) => {
    const { _id, ...data } = libraryData

    data._by = token
    data.city = city
    data.deleted = false

    const model = LibraryFactory.get(type)

    if (_id) {
        await model.findOneAndUpdate({ _id }, { $set: data }, findOptions).lean()
        return libraryData
    }

    return model.create(data)
}

const update = async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const { id } = req.params
        const { type, ...libraryData } = req.body
        const token = getToken(req)

        const model = LibraryFactory.get(type)
        const where = { _id: id, deleted: false }
        const data = { $set: { _by: token, ...libraryData } }
        const library = await model.findOneAndUpdate(where, data, findOptions).lean()

        if (library) {
            res.send(library)
        } else {
            res.send(new errors.NotFoundError(NOT_FOUND_MESSAGE))
        }

        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { create, del, download, getAll, getSingle, save, update, upload }
