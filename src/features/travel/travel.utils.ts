import { dates } from '@/constants/dates.const'
import { notificationStatus } from '@features/notification/constants'
import { operations } from '@constants/operations.const'
import { services } from '@/constants/services.const'

import * as moment from 'moment'
import * as sortBy from 'sort-by'

import { Model, Document, Types } from 'mongoose'
import { roles } from '@features/user/constants'

import { convertAllKeyToString } from '@utils/object'
import { getAgencyId, getUserId } from '@/utils/auth.utils'
import { joinHour } from '@/utils/date.utils'
import { sendNotification } from '@utils/firebase.utils'

import Notification from '@features/notification/notification.schema'
import Service from '@features/service/service.schema'

const getDateOrder = service => {
    switch (service.type) {
        case services.AERIAL:
            return joinHour(service.journeys[0].from.date.toISOString(), service.journeys[0].from.hour.toISOString())
        case services.CAR_RENTAL:
            return joinHour(service.retire.date.toISOString(), service.retire.hour.toISOString())
        case services.CRUISE:
            return joinHour(service.boarding.date.toISOString(), service.boarding.hour.toISOString())
        case services.HOTEL:
            return joinHour(service.checkInDate.toISOString(), service.checkInHour.toISOString())
        case services.RESTAURANT:
            return joinHour(service.reserveDate.toISOString(), service.reserveHour.toISOString())
        case services.TIP:
            return dates.MAXIMUM
        case services.TOUR:
            return joinHour(service.outDate.toISOString(), service.outHour.toISOString())
        case services.TRAIN:
            return joinHour(service.from.date.toISOString(), service.from.hour.toISOString())
        case services.TRANSFER:
            return joinHour(service.date.toISOString(), service.hour.toISOString())
        default:
            return dates.MINIMUM
    }
}

const orderServices = scriptServices => scriptServices.sort(sortBy('dateOrder'))

const populateTravelScriptDates = async travelScript => {
    travelScript.dates = await Promise.all(
        travelScript.dates.map(async date => {
            const scriptServices = await Promise.all(
                date.services.map(async ({ _id }) => {
                    const service = await Service.findOne({ _id })
                        .populate('library')
                        .populate('libraries')
                        .lean()
                    const dateOrder = getDateOrder(service)
                    return { dateOrder, service }
                })
            )
            return { ...date, services: orderServices(scriptServices) }
        })
    )
    return travelScript.dates
}

const findOneAndPopulate = async (schema: Model<Document>, where: Object, populateScriptDates: Boolean = false) => {
    const script = await schema
        .findOne(where)
        .populate({
            path: 'travel',
            populate: {
                path: 'clients'
            }
        })
        .populate({
            path: 'travel',
            populate: {
                path: 'users'
            }
        })
        .lean()

    if (script && populateScriptDates) {
        await populateTravelScriptDates(script)
    }

    return script
}

const getGroupServices = async (idScript: string): Promise<string[]> =>
    Service.find({ script: idScript, deleted: false }).distinct('type')

const getWhere = (role: string, token: string): any => {
    switch (role) {
        case roles.ADMIN:
            return { agency: getAgencyId(token), deleted: false }
        case roles.CLIENT:
            return { agency: getAgencyId(token), clients: { $in: [getUserId(token)] }, closed: true, deleted: false }
        case roles.CONSULTANT:
            return { deleted: false, users: { $in: [getUserId(token)] } }
        default:
            return {}
    }
}

const createNotification = async (client: any, data: any, title: string, message: string) => {
    const newNotification = await Notification.create({
        body: message,
        data,
        date: moment().format(),
        status: notificationStatus.SENT,
        title,
        topic: client.cpf
    })
    return newNotification
}

const processNotification = (clients: any[], scriptId: string) => {
    clients.forEach(client => {
        Notification.find({
            'data.script': Types.ObjectId(scriptId),
            operation: { $in: [operations.INSERT, operations.UPDATE] },
            status: notificationStatus.PENDING,
            topic: client.cpf
        }).then((notifications: any[]) => {
            notifications.forEach((notification: any) => {
                const { body, title, topic, data } = notification
                sendNotification(body, title, topic, convertAllKeyToString(data))
                notification.status = notificationStatus.SENT
                notification.save()
            })
        })
    })
}

export { createNotification, findOneAndPopulate, getGroupServices, getWhere, populateTravelScriptDates, processNotification }
