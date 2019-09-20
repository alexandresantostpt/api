import * as errors from 'restify-errors'
import * as sanitize from 'mongo-sanitize'

import { Model, Document } from 'mongoose'
import { Request, Response, Next } from 'restify'

import { i18n } from '@i18n'

import { handleError } from '@/utils/api.utils'
import { save } from './file.utils'
import { getToken, getAgencyId } from './auth.utils'
import { services } from '@/constants/services.const'
import Library from '@/features/library/library.schema'

const _create = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const token = getToken(req)
        const agencyId = getAgencyId(token)
        res.send(await schema.create({ ...req.body, _by: token, agency: agencyId }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _get = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const {
            params: { id }
        } = req
        const aerial = await schema
            .findById({ _id: id, deleted: false })
            .populate('library')
            .populate('libraries')
            .lean()
        res.send(aerial)
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _getAll = (schema: Model<Document>, type: services) => async (req: Request, res: Response, next: Next) => {
    try {
        res.send(await schema.find({ deleted: false, type }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _update = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const token = getToken(req)
        const agencyId = getAgencyId(token)
        const { body } = req
        const id = sanitize(body._id)
        let { __v } = body
        if (__v !== undefined && __v !== null) {
            res.send(
                await schema.findOneAndUpdate(
                    { _id: id },
                    { ...body, __v: ++__v, _by: token, agency: agencyId },
                    { context: 'query', new: true }
                )
            )
        } else {
            res.send(new errors.BadRequestError(i18n.t('validations.versionAttribute')))
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _uploadToLibrary = (schema: Model<Document>, type: any) => async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const {
            body,
            params: { id }
        } = req
        const fileName = save(body)
        if (fileName) {
            const service: any = await schema.findOne({ _id: id })
            service._by = token
            service.save()

            const library: any = await Library.findOne({ _id: service.library }, { context: 'query', new: true })
            library._by = token
            library.image = fileName
            library.save()

            service.populate('library')

            res.send(service)
        } else {
            res.end()
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const crudService = (schema: Model<Document>, type: services) => ({
    create: _create(schema),
    get: _get(schema),
    getAll: _getAll(schema, type),
    update: _update(schema),
    uploadToLibrary: _uploadToLibrary(schema, type)
})

export { crudService }
