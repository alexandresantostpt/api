import * as mongoose from 'mongoose'

import { i18n } from '@i18n'

import Notification from '@features/notification/notification.schema'
import Travel from '@features/travel/travel.schema'

const createOrUpdateServiceNofication = async (obj: any, travelId: string, pushDate: string, token: string, update = false) => {
    const data = { ...obj }
    const message = i18n.t(`messages.push.services.${data.type}`, { lng: 'pt' })
    const title = i18n.t('titles.push.service', { lng: 'pt' })

    const travel = await Travel.findOne({ _id: travelId })
        .populate('clients')
        .lean()

    if (travel) {
        travel.clients.forEach(async client => {
            const notification = {
                _by: token,
                body: message,
                data,
                date: pushDate,
                title,
                topic: client.cpf
            }
            if (update) {
                await Notification.updateMany({ 'data._id': mongoose.Types.ObjectId(data._id) }, notification)
            } else {
                await Notification.create(notification)
            }
        })
    }
}

export { createOrUpdateServiceNofication }
