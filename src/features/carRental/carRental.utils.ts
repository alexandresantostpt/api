import { dateFormats } from '@/constants/dateFormats.const'

import * as moment from 'moment'

import { i18n } from '@i18n'

import Client from '../client/client.schema'
import Notification from '@features/notification/notification.schema'

const createNotifications = async (doc: any, operation: string) => {
    const passengers = await Client.find({ _id: { $in: doc.passengerResponsible } }).lean()
    passengers.forEach(async passenger => {
        await Notification.create({
            body: `${i18n.t('messages.push.carRental.retire', { lng: 'pt' })} ${moment(doc.retire.hour)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushRetireDate,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: passenger.cpf
        })
        await Notification.create({
            body: `${i18n.t('messages.push.carRental.devolution', { lng: 'pt' })} ${moment(doc.devolution.hour)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushDevolutionDate,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: passenger.cpf
        })
        await Notification.create({
            body: i18n.t(`messages.push.${operation}.carRental`, {
                date: moment(doc.retire.date)
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
