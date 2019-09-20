import { mocks } from '@/constants/mocks.const'
import { roles } from './constants'

import * as moment from 'moment'
import * as errors from 'restify-errors'

import { Request, Response, Next } from 'restify'

import { config } from '@config/config'
import { i18n } from '@i18n'

import { createJwt, cryptPassword, decodeJwt, getAgencyId, getToken } from '@utils/auth.utils'
import { crud } from '@utils/database.utils'
import { checkIsBefore } from '@utils/date.utils'
import { handleError } from '@/utils/api.utils'
import { sendEmail } from '@/utils/email.utils'

import { render } from './templates/rememberPassword'

import User from './user.schema'

const { create, del, download, edit, getFields, update, upload } = crud(User)

const getAll = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const agencyId = getAgencyId(token)
        res.send(await User.find({ agency: agencyId, deleted: false, name: { $ne: mocks.DEXTRA_USER_NAME }, role: roles.CONSULTANT }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const rememberPassword = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body: { email }
        } = req
        const expiresDate = moment()
            .add(10, 'm')
            .valueOf()
        const { name } = await User.findOne({ email }).lean()
        const token = createJwt(email, expiresDate)
        const url = `${config.app.url}/reset/password?hash=${token}&from=platform`
        await sendEmail({
            from: i18n.t('froms.tpt', { lng: 'pt' }),
            html: render(url, name),
            subject: i18n.t('subjects.rememberPassword', { lng: 'pt' }),
            to: email
        })
        res.end()
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
                await User.findOneAndUpdate(
                    { email },
                    { $set: { _by: token, password: cryptPassword(password, email) } },
                    { context: 'query', new: true }
                )
                res.end()
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

const updatePassword = async (req: Request, res: Response, next: Next) => {
    try {
        const { body } = req
        const { _id: id, newPassword, oldPassword } = body
        const user = await User.findOne({ _id: id })
            .select('+password')
            .lean()
        const oldPasswordHash = cryptPassword(oldPassword, user.email)
        const token = getToken(req)
        if (oldPasswordHash === user.password) {
            const newPasswordHash = cryptPassword(newPassword, user.email)
            res.send(
                await User.findOneAndUpdate(
                    { _id: id },
                    { ...user, _by: token, active: true, password: newPasswordHash },
                    { context: 'query', new: true }
                )
            )
            next()
            return
        }
        res.send(new errors.BadRequestError(i18n.t('messages.passwordNotMatch')))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { create, del, download, edit, getAll, getFields, rememberPassword, resetPassword, update, updatePassword, upload }
