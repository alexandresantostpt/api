import { minutes } from '@constants/times.const'
import { operations } from '@/constants/operations.const'
import { services } from '@/constants/services.const'

import { driverTypes } from '@constants/driverTypes.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { i18n } from '@i18n'

import { createPushDate } from '@utils/date.utils'
import { createNotifications } from './transfer.utils'
import { not } from '@utils/functions.utils'
import { removingMissingClients, checkDateBetweenTravelRange } from '@/utils/service.utils'
import { updateVersionKey } from '@utils/model.utils'

import Notification from '@features/notification/notification.schema'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    car: {
        board: {
            maxlength: 15,
            required: false,
            trim: true,
            type: String
        },
        model: {
            maxlength: 60,
            required: true,
            trim: true,
            type: String
        }
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
    driver: {
        howIdentify: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        name: {
            maxlength: 120,
            required: false,
            trim: true,
            type: String
        },
        phone: {
            required: false,
            type: String
        }
    },
    estimatedTimeOfArrival: {
        required: false,
        type: Date
    },
    guideOrDriver: {
        enum: driverTypes,
        maxlength: 20,
        required: true,
        trim: true,
        type: String
    },
    hour: {
        required: true,
        type: Date
    },
    localOperator: {
        maxlength: 120,
        required: true,
        trim: true,
        type: String
    },
    meetPoint: {
        maxlength: 255,
        required: true,
        trim: true,
        type: String
    },
    observation: {
        required: false,
        trim: true,
        type: String
    },
    passengers: [
        {
            ref: 'Client',
            required: false,
            type: mongoose.Schema.Types.ObjectId
        }
    ]
})

schema.plugin(history)

schema.methods.checkClients = function(newClients: any) {
    this.passengers = removingMissingClients(this.passengers, newClients, this._id)
}

schema.virtual('pushDate').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.date, this.hour, minutes.ONE_HOUR)
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

const TransferService = Service.discriminator(services.TRANSFER, schema)

export default TransferService
