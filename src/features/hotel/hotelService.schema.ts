import { minutes } from '@constants/times.const'
import { operations } from '@/constants/operations.const'
import { services } from '@constants/services.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { i18n } from '@i18n'

import { checkDateBetweenTravelRange, removingMissingClients } from '@utils/service.utils'
import { checkIntervalMinute, createPushDate, joinHour } from '@utils/date.utils'
import { createNotifications } from './hotel.utils'
import { not } from '@utils/functions.utils'
import { updateVersionKey } from '@utils/model.utils'

import Notification from '@features/notification/notification.schema'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    checkInDate: {
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
    checkInHour: {
        required: true,
        type: Date
    },
    checkOutDate: {
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
    checkOutHour: {
        required: true,
        type: Date,
        validate: {
            message: i18n.t('validations.checkOutHour'),
            validator: function(value) {
                let initialTime = null
                let finalTime = null
                if (this.getUpdate) {
                    initialTime = joinHour(this.getUpdate().$set.checkInDate, this.getUpdate().$set.checkInHour)
                    finalTime = joinHour(this.getUpdate().$set.checkOutDate, value)
                    return checkIntervalMinute(initialTime.format(), finalTime.format())
                }
                initialTime = joinHour(this.checkInDate, this.checkInHour)
                finalTime = joinHour(this.checkOutDate, value)
                return checkIntervalMinute(initialTime.format(), finalTime.format())
            }
        }
    },
    guestCount: {
        min: 0,
        required: true,
        type: Number
    },
    passengers: [
        {
            ref: 'Client',
            required: true,
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    reserveCode: {
        maxlength: 15,
        required: false,
        trim: true,
        type: String
    },
    roomType: {
        maxlength: 120,
        required: true,
        trim: true,
        type: String
    }
})

schema.plugin(history)

schema.methods.checkClients = function(newClients: any) {
    this.passengers = removingMissingClients(this.passengers, newClients, this._id)
}

schema.virtual('pushCheckInDate').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.checkInDate, this.checkInHour, minutes.ONE_HOUR)
})

schema.virtual('pushCheckOutDate').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.checkOutDate, this.checkOutHour, minutes.ONE_HOUR)
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

const HotelService = Service.discriminator(services.HOTEL, schema)

export default HotelService
