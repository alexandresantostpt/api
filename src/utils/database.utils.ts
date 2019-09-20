import * as errors from 'restify-errors'
import * as sanitize from 'mongo-sanitize'

import { Model, Document } from 'mongoose'
import { Request, Response, Next } from 'restify'

import { i18n } from '@i18n'

import { getToken } from '@utils/auth.utils'
import { handleError } from '@utils/api.utils'
import { read, save } from '@utils/file.utils'

const _create = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const token = getToken(req)
        res.send(await schema.create({ ...req.body, _by: token }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _del = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const token = getToken(req)
        const id = req.params.id
        res.send(await schema.findOneAndUpdate({ _id: id }, { $set: { _by: token, deleted: true } }, { context: 'query', new: true }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _download = (schema: Model<Document>) => async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { image }
        } = req
        const file = read(image)
        if (file) {
            res.write(file)
            res.end()
        } else {
            res.end()
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

// FIXME: why this const is named "_edit" it should be named as "_get"
const _edit = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const {
            params: { id }
        } = req
        res.send(await schema.findById({ _id: id, deleted: false }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _getAll = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        res.send(await schema.find({ deleted: false }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _getFields = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        res.send(schema.schema.obj)
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _update = (schema: Model<Document>) => async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const token = getToken(req)
        const { body } = req
        const id = sanitize(body._id)
        let { __v } = body
        if (__v !== undefined && __v !== null) {
            res.send(await schema.findOneAndUpdate({ _id: id }, { ...body, __v: ++__v, _by: token }, { context: 'query', new: true }))
        } else {
            res.send(new errors.BadRequestError(i18n.t('validations.versionAttribute')))
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const _upload = (schema: Model<Document>) => async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const {
            body,
            params: { id }
        } = req
        const fileName = save(body)
        if (fileName) {
            const model: any = await schema.findOne({ _id: id })
            model._by = token
            model.image = fileName
            model.save()
            res.send(model)
        } else {
            res.end()
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const crud = (schema: Model<Document>) => ({
    create: _create(schema),
    del: _del(schema),
    download: _download(schema),
    edit: _edit(schema),
    getAll: _getAll(schema),
    getFields: _getFields(schema),
    update: _update(schema),
    upload: _upload(schema)
})

export { crud }
