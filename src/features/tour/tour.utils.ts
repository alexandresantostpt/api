import * as moment from 'moment'

import { i18n } from '@i18n'

import Client from '../client/client.schema'
import Notification from '@features/notification/notification.schema'
import TourLibrary from './tourLibrary.schema'

const createNotifications = async (doc: any, operation: string) => {
    const library = await TourLibrary.findOne({ _id: doc.library }).lean()
    const passengers = await Client.find({ _id: { $in: doc.passengers } }).lean()
    passengers.forEach(async passenger => {
        await Notification.create({
            body: `${i18n.t('messages.push.tour.oneHour', { lng: 'pt' })} ${moment(doc.outHour)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushDateOneHour,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: passenger.cpf
        })
        await Notification.create({
            body: `${i18n.t('messages.push.tour.twelveHours', { lng: 'pt' })} ${moment(doc.outHour)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushDateTwelveHour,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: passenger.cpf
        })
        await Notification.create({
            body: i18n.t(`messages.push.${operation}.tour`, { name: library.name, lng: 'pt' }),
            data: doc,
            date: moment().format(),
            operation,
            title: i18n.t(`titles.push.${operation}`, { lng: 'pt' }),
            topic: passenger.cpf
        })
    })
}

export { createNotifications }
