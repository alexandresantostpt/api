import { driverTypes } from '@constants/driverTypes.const'
import { minutes } from '@constants/times.const'
import { operations } from '@/constants/operations.const'
import { services } from '@/constants/services.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { i18n } from '@i18n'

import { createPushDate } from '@utils/date.utils'
import { createNotifications } from './tour.utils'
import { not } from '@utils/functions.utils'
import { removingMissingClients, checkDateBetweenTravelRange } from '@/utils/service.utils'
import { updateVersionKey } from '@utils/model.utils'

import Notification from '@features/notification/notification.schema'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    address: {
        maxlength: 255,
        required: false,
        trim: true,
        type: String
    },
    guideOrDriver: {
        enum: driverTypes,
        maxlength: 20,
        required: true,
        trim: true,
        type: String
    },
    localOperator: {
        maxlength: 120,
        required: true,
        trim: true,
        type: String
    },
    observation: {
        required: false,
        trim: true,
        type: String
    },
    outDate: {
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
    outHour: {
        required: true,
        type: Date
    },
    passengers: [
        {
            ref: 'Client',
            required: false,
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    peopleCount: {
        min: 0,
        required: true,
        type: Number
    },
    transferType: {
        maxlength: 30,
        required: true,
        trim: true,
        type: String
    }
})

schema.plugin(history)

schema.methods.checkClients = function(newClients: any) {
    this.passengers = removingMissingClients(this.passengers, newClients, this._id)
}

schema.virtual('pushDateOneHour').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.outDate, this.outHour, minutes.ONE_HOUR)
})

schema.virtual('pushDateTwelveHour').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.outDate, this.outHour, minutes.TWELVE_HOURS)
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

const TourService = Service.discriminator(services.TOUR, schema)

export default TourService
