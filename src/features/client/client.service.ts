import { roles } from '../user/constants'

import * as moment from 'moment'
import * as errors from 'restify-errors'
import * as emailMask from 'email-mask'

import { Request, Response, Next } from 'restify'

import { config } from '@config/config'
import { i18n } from '@i18n'

import { cryptPassword, createJwt, decodeJwt, getAgencyId, getToken } from '@utils/auth.utils'
import { checkIsBefore } from '@utils/date.utils'
import { crud } from '@utils/database.utils'
import { handleError } from '@/utils/api.utils'
import { saveWithBase64 } from '@utils/file.utils'
import { sendEmail } from '@/utils/email.utils'

import { render } from './templates/rememberPassword'

import Client from './client.schema'

const { create, del, download, edit, getFields, update } = crud(Client)

const creatingClients = (clients: any[], token: string): Promise<any>[] => {
    return clients.map(client => {
        const { _id: clientId } = client
        delete client._id
        if (clientId) {
            return Client.findByIdAndUpdate({ _id: clientId }, { ...client, _by: token }).then(updatedClient =>
                Promise.resolve(updatedClient._id)
            )
        }
        return Client.create({ ...client, _by: token }).then(newClient => Promise.resolve(newClient._id))
    })
}

const getAll = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const agencyId = getAgencyId(token)
        res.send(await Client.find({ agency: agencyId, deleted: false, role: roles.CLIENT }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const rememberPassword = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body: { cpf }
        } = req
        const expiresDate = moment()
            .add(10, 'm')
            .valueOf()
        const { email, name } = await Client.findOne({ cpf }).lean()
        const token = createJwt(email, expiresDate)
        const url = `${config.app.url}/reset/password?hash=${token}&from=app`
        await sendEmail({
            from: i18n.t('froms.tpt', { lng: 'pt' }),
            html: render(url, name),
            subject: i18n.t('subjects.rememberPassword', { lng: 'pt' }),
            to: email
        })
        res.send({ email: emailMask(email) })
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const resetPassword = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const {
            body: { password, confirmPassword }
        } = req
        const { expires, user: email } = decodeJwt(token)
        if (password === confirmPassword) {
            if (checkIsBefore(expires)) {
                res.send(await Client.updateMany({ email }, { $set: { _by: token, password: cryptPassword(password, email) } }))
            } else {
                res.send(new errors.ForbiddenError())
            }
        } else {
            res.send(new errors.BadRequestError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const search = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            query: { q }
        } = req

        const token = getToken(req)
        const agencyId = getAgencyId(token)

        res.send(await Client.find({ agency: agencyId, deleted: false, name: { $regex: new RegExp(`^${q}`, 'i') } }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const updatePassword = async (req: Request, res: Response, next: Next) => {
    try {
        const { body } = req
        const { cpf, newPassword, oldPassword } = body
        const { email } = await Client.findOne({ cpf }).lean()
        const token = getToken(req)
        const oldPasswordHash = cryptPassword(oldPassword, email)
        const clients: any = await Client.find({ email, password: oldPasswordHash })
            .select('+password')
            .lean()
        if (clients.length) {
            const newPasswordHash = cryptPassword(newPassword, email)
            res.send(await Client.updateMany({ email }, { $set: { _by: token, active: true, password: newPasswordHash } }))
            next()
            return
        }
        res.send(new errors.BadRequestError(i18n.t('messages.passwordNotMatch')))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const upload = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body: { data },
            params: { id }
        } = req
        const token = getToken(req)
        const fileName = saveWithBase64(data, Client.collection.name)
        if (fileName) {
            const client: any = await Client.findOne({ _id: id })
            client._by = token
            client.image = fileName
            client.save()
            res.send(client)
        } else {
            res.send(new errors.BadRequestError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export {
    create,
    creatingClients,
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
}
