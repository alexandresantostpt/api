import { TRAVEL_STATUS, travelStatus } from './constants'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { i18n } from '@i18n'

import { checkIntervalDay } from '@/utils/date.utils'
import { updateVersionKey } from '@utils/model.utils'

const schema = new mongoose.Schema(
    {
        _by: {
            required: true,
            select: false,
            trim: true,
            type: String
        },
        agency: {
            ref: 'Agency',
            required: true,
            type: mongoose.Schema.Types.ObjectId
        },
        archived: {
            default: false,
            required: true,
            type: Boolean
        },
        citiesDestiny: [
            {
                id: {
                    maxlength: 255,
                    required: true,
                    trim: true,
                    type: String
                },
                name: {
                    maxlength: 120,
                    required: true,
                    trim: true,
                    type: String
                },
                timezone: {
                    maxlength: 30,
                    required: true,
                    trim: true,
                    type: String
                }
            }
        ],
        clients: [
            {
                ref: 'Client',
                required: true,
                type: mongoose.Schema.Types.ObjectId
            }
        ],
        closed: {
            default: false,
            required: true,
            type: Boolean
        },
        deleted: {
            default: false,
            required: true,
            type: Boolean
        },
        image: {
            maxlength: 255,
            required: false,
            trim: true,
            type: String
        },
        status: {
            default: travelStatus.PENDING,
            enum: TRAVEL_STATUS,
            maxlength: 15,
            required: true,
            type: String
        },
        title: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        travelEndDate: {
            required: true,
            type: Date,
            validate: {
                message: i18n.t('validations.finalDate'),
                validator: function(value) {
                    if (this.getUpdate) {
                        return checkIntervalDay(this.getUpdate().travelStartDate, value)
                    }
                    return checkIntervalDay(this.travelStartDate, value)
                }
            }
        },
        travelStartDate: {
            required: true,
            type: Date
        },
        users: [
            {
                ref: 'User',
                required: true,
                type: mongoose.Schema.Types.ObjectId
            }
        ]
    },
    { timestamps: true }
)

schema.plugin(history)

const Travel = mongoose.model('Travel', schema, 'travels')

schema.pre('findOneAndUpdate', updateVersionKey)

export default Travel
