import { services } from '@/constants/services.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { removingMissingClients, checkDateBetweenTravelRange } from '@/utils/service.utils'
import { updateVersionKey } from '@utils/model.utils'
import { i18n } from '@/_translate/i18n'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    boarding: {
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
        point: {
            maxlength: 255,
            required: true,
            trim: true,
            type: String
        }
    },
    cabinNumber: {
        maxlength: 15,
        required: false,
        type: String
    },
    cabinType: {
        maxlength: 30,
        required: true,
        trim: true,
        type: String
    },
    category: {
        maxlength: 30,
        required: false,
        trim: true,
        type: String
    },
    landing: {
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
        point: {
            maxlength: 255,
            required: true,
            trim: true,
            type: String
        }
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
    ],
    reserveNumber: {
        maxlength: 15,
        required: true,
        trim: true,
        type: String
    },
    shipName: {
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

schema.pre('findOneAndUpdate', updateVersionKey)

const CruiseService = Service.discriminator(services.CRUISE, schema)

export default CruiseService
