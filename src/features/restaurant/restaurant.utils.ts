import * as moment from 'moment'

import { i18n } from '@i18n'

import Client from '../client/client.schema'
import Notification from '@features/notification/notification.schema'
import RestaurantLibrary from './restaurantLibrary.schema'

const createNotifications = async (doc: any, operation: string) => {
    const library = await RestaurantLibrary.findOne({ _id: doc.library }).lean()
    const clients = await Client.find({ _id: { $in: doc.clients } }).lean()
    clients.forEach(async client => {
        await Notification.create({
            body: `${i18n.t('messages.push.restaurant', { lng: 'pt' })} ${moment(doc.reserveDate)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushDate,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: client.cpf
        })
        await Notification.create({
            body: i18n.t(`messages.push.${operation}.restaurant`, {
                lng: 'pt',
                name: library.name
            }),
            data: doc,
            date: moment().format(),
            operation,
            title: i18n.t(`titles.push.${operation}`, { lng: 'pt' }),
            topic: client.cpf
        })
    })
}

export { createNotifications }
