import { minutes } from '@constants/times.const'
import { operations } from '@/constants/operations.const'
import { services } from '@/constants/services.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { i18n } from '@i18n'

import { createNotifications } from './restaurant.utils'
import { createPushDate } from '@utils/date.utils'
import { not } from '@utils/functions.utils'
import { removingMissingClients, checkDateBetweenTravelRange } from '@/utils/service.utils'
import { updateVersionKey } from '@utils/model.utils'

import Notification from '@features/notification/notification.schema'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    clients: [
        {
            ref: 'Client',
            required: true,
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    confirmedBy: {
        maxlength: 120,
        required: true,
        trim: true,
        type: String
    },
    observations: {
        required: false,
        trim: true,
        type: String
    },
    peopleCount: {
        min: 0,
        required: true,
        type: Number
    },
    reserveClientName: {
        maxlength: 120,
        required: true,
        trim: true,
        type: String
    },
    reserveDate: {
        required: true,
        type: Date,
        validate: {
            message: i18n.t('validations.serviceDateNotInBetween'),
            validator: function(value) {
                if (this.getUpdate) {
                    return checkDateBetweenTravelRange(this.getUpdate().$set.script, value)
                }
                return checkDateBetweenTravelRange(this.script, value)
            }
        }
    },
    reserveHour: {
        required: true,
        type: Date
    },
    reserveNumber: {
        maxlength: 15,
        required: false,
        type: String
    }
})

schema.plugin(history)

schema.methods.checkClients = function(newClients: any) {
    this.clients = removingMissingClients(this.clients, newClients, this._id)
}

schema.virtual('pushDate').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.reserveDate, this.reserveHour, minutes.THREE_HOURS)
})

schema.pre('findOneAndUpdate', updateVersionKey)

schema.post('findOneAndUpdate', async function(doc: any) {
    await Notification.deleteMany({ 'data._id': mongoose.Types.ObjectId(doc._id) })
    if (not(doc.deleted)) {
        await createNotifications(doc, operations.UPDATE)
    }
})

schema.post('save', async function(doc: any) {
    await createNotifications(doc, operations.INSERT)
})

const RestaurantService = Service.discriminator(services.RESTAURANT, schema)

export default RestaurantService
