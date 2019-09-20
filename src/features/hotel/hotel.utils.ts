import * as moment from 'moment'

import { i18n } from '@i18n'

import Client from '../client/client.schema'
import Notification from '@features/notification/notification.schema'
import HotelLibrary from './hotelLibrary.schema'

const createNotifications = async (doc: any, operation: string) => {
    const library = await HotelLibrary.findOne({ _id: doc.library }).lean()
    const passengers = await Client.find({ _id: { $in: doc.passengers } }).lean()
    passengers.forEach(async passenger => {
        await Notification.create({
            body: `${i18n.t('messages.push.hotel.checkIn', { lng: 'pt' })} ${moment(doc.checkInHour)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushCheckInDate,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: passenger.cpf
        })
        await Notification.create({
            body: `${i18n.t('messages.push.hotel.checkOut', { lng: 'pt' })} ${moment(doc.checkOutHour)
                .utc(false)
                .hour()}h`,
            data: doc,
            date: await doc.pushCheckOutDate,
            title: i18n.t('titles.push.near', { lng: 'pt' }),
            topic: passenger.cpf
        })
        await Notification.create({
            body: i18n.t(`messages.push.${operation}.hotel`, { name: library.name, lng: 'pt' }),
            data: doc,
            date: moment().format(),
            operation,
            title: i18n.t(`titles.push.${operation}`, { lng: 'pt' }),
            topic: passenger.cpf
        })
    })
}

export { createNotifications }
