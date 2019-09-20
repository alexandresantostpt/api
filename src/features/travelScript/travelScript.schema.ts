import * as history from 'historical'
import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import CitySchema from '../city/city.schema'

const schema = new mongoose.Schema(
    {
        _by: {
            required: true,
            select: false,
            trim: true,
            type: String
        },
        dates: [
            {
                city: CitySchema,
                date: {
                    required: true,
                    type: Date
                },
                services: [
                    {
                        service: {
                            ref: 'Service',
                            required: false,
                            type: mongoose.Schema.Types.ObjectId
                        }
                    }
                ]
            }
        ],
        deleted: {
            default: false,
            required: true,
            type: Boolean
        },
        travel: {
            ref: 'Travel',
            required: true,
            type: mongoose.Schema.Types.ObjectId
        }
    },
    { timestamps: true }
)

schema.plugin(history)

const TravelScript = mongoose.model('TravelScript', schema, 'travelScripts')

schema.pre('findOneAndUpdate', updateVersionKey)

export default TravelScript
