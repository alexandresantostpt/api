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
        agency: {
            ref: 'Agency',
            required: true,
            type: mongoose.Schema.Types.ObjectId
        },
        any: {},
        city: CitySchema,
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
        name: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        type: {
            maxlength: 30,
            required: true,
            trim: true,
            type: String
        }
    },
    {
        collection: 'libraries',
        discriminatorKey: 'type',
        timestamps: true
    }
)

schema.pre('findOneAndUpdate', updateVersionKey)

const Library = mongoose.model('Library', schema)

export default Library
