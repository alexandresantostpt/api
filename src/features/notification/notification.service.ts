import { notificationStatus } from './constants'

import * as errors from 'restify-errors'
import * as moment from 'moment'

import { Request, Response, Next } from 'restify'

import { handleError } from '@utils/api.utils'
import { crud } from '@utils/database.utils'
import { getCpf, getToken, getUserId } from '@utils/auth.utils'
import { toInt } from '@utils/numbers.utils'

import Notification from './notification.schema'

const { del, getFields } = crud(Notification)

const getAll = async (where: any, page: number, pageCount: number): Promise<any[]> => {
    const notifications = await Notification.find({ ...where, deleted: false, status: notificationStatus.SENT })
        .skip(page ? (page - 1) * pageCount : page)
        .limit(pageCount)
        .sort([['date', -1]])
        .lean()
    return notifications
}

const getAllRead = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            query: { page = 0, pageCount = 10 }
        } = req
        const token = getToken(req)
        const cpf = getCpf(token)
        const userId = getUserId(token)
        res.send(await getAll({ 'read.readBy': userId, topic: cpf }, toInt(page), toInt(pageCount)))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const getAllUnread = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            query: { page = 0, pageCount = 10 }
        } = req
        const token = getToken(req)
        const cpf = getCpf(token)
        const userId = getUserId(token)
        res.send(await getAll({ 'read.readBy': { $ne: userId }, topic: cpf }, toInt(page), toInt(pageCount)))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const read = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body: { notificationId }
        } = req
        const token = getToken(req)
        const userId = getUserId(token)
        const notification = await Notification.findOne({ _id: notificationId }).lean()
        const newRead = { readAt: moment().format(), readBy: userId }
        const newNotifications = notification.read && notification.read.length ? [...notification.read, newRead] : [newRead]
        res.send(await Notification.findOneAndUpdate({ _id: notificationId }, { $set: { read: newNotifications } }, { new: true }))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { del, getAllRead, getAllUnread, getFields, read }
