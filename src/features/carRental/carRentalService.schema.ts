import { minutes } from '@constants/times.const'
import { operations } from '@/constants/operations.const'
import { services } from '@/constants/services.const'

import { requiredDocuments } from '@constants/requiredDocuments.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { i18n } from '@i18n'

import { createPushDate } from '@utils/date.utils'
import { checkDateBetweenTravelRange } from '@/utils/service.utils'
import { createNotifications } from './carRental.utils'
import { not } from '@utils/functions.utils'
import { removingMissingClients } from '@utils/service.utils'
import { updateVersionKey } from '@utils/model.utils'

import Notification from '@features/notification/notification.schema'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    carModel: {
        maxlength: 30,
        required: true,
        trim: true,
        type: String
    },
    devolution: {
        address: {
            maxlength: 255,
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
        name: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        operationHourEnd: {
            required: true,
            type: Date
        },
        operationHourStart: {
            required: true,
            type: Date
        },
        phoneNumber: {
            required: false,
            type: String
        }
    },
    passengerResponsible: [
        {
            ref: 'Client',
            required: false,
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    requiredDocuments: [
        {
            enum: requiredDocuments,
            maxlength: 10,
            required: true,
            trim: true,
            type: String
        }
    ],
    retire: {
        address: {
            maxlength: 255,
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
        name: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        operationHourEnd: {
            required: true,
            type: Date
        },
        operationHourStart: {
            required: true,
            type: Date
        },
        phoneNumber: {
            required: false,
            type: String
        },
        site: {
            maxlength: 255,
            required: false,
            trim: true,
            type: String
        }
    }
})

schema.plugin(history)

schema.methods.checkClients = function(newClients: any) {
    this.passengerResponsible = removingMissingClients(this.passengerResponsible, newClients, this._id)
}

schema.virtual('pushDevolutionDate').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.devolution.date, this.devolution.hour, minutes.ONE_HOUR)
})

schema.virtual('pushRetireDate').get(async function() {
    return createPushDate(this.script, this.scriptDate, this.retire.date, this.retire.hour, minutes.ONE_HOUR)
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

const CarRentalService = Service.discriminator(services.CAR_RENTAL, schema)

export default CarRentalService
