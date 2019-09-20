import { minutes } from '@constants/times.const'
import { operations } from '@/constants/operations.const'
import { services } from '@/constants/services.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { i18n } from '@i18n'

import { createPushDate } from '@utils/date.utils'
import { createNotifications } from './train.utils'
import { not } from '@utils/functions.utils'
import { updateVersionKey } from '@utils/model.utils'
import { removingMissingClients, checkDateBetweenTravelRange } from '@/utils/service.utils'

import Notification from '@features/notification/notification.schema'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    destiny: {
        city: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        state: {
            maxlength: 60,
            required: true,
            trim: true,
            type: String
        }
    },
    from: {
        city: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        date: {
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
        hour: {
            required: true,
            type: Date
        },
        state: {
            maxlength: 60,
            required: true,
            trim: true,
            type: String
        }
    },
    hourEstimatedArrival: {
        required: true,
        type: Date
    },
    passengers: [
        {
            client: {
                ref: 'Client',
                required: false,
                type: mongoose.Schema.Types.ObjectId
            },
            platform: {
                maxlength: 30,
                required: false,
                trim: true,
                type: String
            },
            seat: {
                maxlength: 30,
                required: false,
                trim: true,
                type: String
            },
            wagon: {
                maxlength: 30,
                required: false,
                trim: true,
                type: String
            }
        }
    ]
})

schema.plugin(history)

schema.methods.checkClients = function(newClients: any) {
    this.passengers = removingMissingClients(this.passengers, newClients, this._id, 'client')
}

schema.virtual('pushDate').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.from.date, this.from.hour, minutes.THREE_HOURS)
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

const Train = Service.discriminator(services.TRAIN, schema)

export default Train
