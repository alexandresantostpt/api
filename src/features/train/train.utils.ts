import * as moment from 'moment'

import { i18n } from '@i18n'

import Client from '../client/client.schema'
import Notification from '@features/notification/notification.schema'

const createNotifications = async (doc: any, operation: string) => {
    doc.passengers.forEach(async passenger => {
        const client = await Client.findOne({ _id: passenger.client }).lean()
        await Notification.create({
            body: `${i18n.t('messages.push.train', { lng: 'pt' })} ${moment(doc.from.hour)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushDate,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: client.cpf
        })
        await Notification.create({
            body: i18n.t(`messages.push.${operation}.train`, { name: doc.destiny.city, lng: 'pt' }),
            data: doc,
            date: moment().format(),
            operation,
            title: i18n.t(`titles.push.${operation}`, { lng: 'pt' }),
            topic: client.cpf
        })
    })
}

export { createNotifications }
