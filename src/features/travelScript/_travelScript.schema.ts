import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'

const schema = new mongoose.Schema(
    {
        dates: [
            {
                city: {
                    id: {
                        maxlength: 255,
                        required: false,
                        trim: true,
                        type: String
                    },
                    name: {
                        maxlength: 120,
                        required: false,
                        trim: true,
                        type: String
                    },
                    timezone: {
                        maxlength: 30,
                        required: false,
                        trim: true,
                        type: String
                    }
                },
                date: {
                    required: true,
                    type: Date
                },
                services: [
                    {
                        required: false,
                        type: Object
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

const _TravelScript = mongoose.model('_TravelScript', schema, '_travelScripts')

schema.pre('findOneAndUpdate', updateVersionKey)

export default _TravelScript
