import { dateFormats } from '@/constants/dateFormats.const'

import * as moment from 'moment'

import { i18n } from '@i18n'

import Client from '../client/client.schema'
import Notification from '@features/notification/notification.schema'

const createNotifications = async (doc: any, operation: string) => {
    const passengers = await Client.find({ _id: { $in: doc.passengers } }).lean()
    passengers.forEach(async passenger => {
        await Notification.create({
            body: `${i18n.t('messages.push.transfer', { lng: 'pt' })} ${moment(doc.hour)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushDate,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: passenger.cpf
        })
        await Notification.create({
            body: i18n.t(`messages.push.${operation}.transfer`, {
                date: moment(doc.date)
                    .utc(false)
                    .format(dateFormats.BRASILIAN_SHORT),
                lng: 'pt'
            }),
            data: doc,
            date: moment().format(),
            operation,
            title: i18n.t(`titles.push.${operation}`, { lng: 'pt' }),
            topic: passenger.cpf
        })
    })
}

export { createNotifications }
