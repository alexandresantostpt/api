import * as moment from 'moment'
import * as errors from 'restify-errors'

import { Model, Document } from 'mongoose'
import { Request, Response, Next } from 'restify'

import { i18n } from '@i18n'

import { createJwt, cryptPassword, decodeJwt, getCpf, getToken } from '@/utils/auth.utils'
import { handleError } from '@/utils/api.utils'

import Agency from '@features/agency/agency.schema'
import Client from '@features/client/client.schema'
import User from '@features/user/user.schema'

const auth = async (Schema: Model<Document>, req: Request, res: Response, next: Next) => {
    const {
        body: { password, user: email }
    } = req
    const where = {
        blocked: false,
        deleted: false,
        email,
        password: cryptPassword(password, email)
    }
    const user: any = await Schema.findOneAndUpdate(where, { $set: { lastAccess: moment() } }, { context: 'query', new: true })
    if (user) {
        const { dto, expires } = await user.toObj()
        const token = createJwt(dto, expires)
        return res.send(token)
    }
    res.send(new errors.UnauthorizedError(i18n.t('messages.unauthorized')))
    next()
}

const authAgency = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body: { agency: agencyId }
        } = req
        const token = getToken(req)
        const decoded = decodeJwt(token)
        const user = await Client.findOne({ cpf: decoded.user.cpf, email: decoded.user.email }).lean()
        const agency: any = await Agency.findOne({ _id: agencyId }).lean()
        const newToken = createJwt({ ...user, agency: agency._id, logo: agency.image, theme: agency.appTheme || {} }, decoded.expires)
        res.send(newToken)
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const authMobile = async (req: Request, res: Response, next: Next) => {
    try {
        auth(Client, req, res, next)
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const authPlatform = async (req: Request, res: Response, next: Next) => {
    try {
        auth(User, req, res, next)
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const getAgencies = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const agenciesId = await Client.find({ cpf: getCpf(token) }).distinct('agency')
        res.send(await Agency.find({ _id: { $in: agenciesId } }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { authAgency, authMobile, authPlatform, getAgencies }
