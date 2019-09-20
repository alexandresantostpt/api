import { libraries } from '@/constants/libraries.const'

import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'

import Library from '../library/library.schema'

const schema = new mongoose.Schema({
    address: {
        maxlength: 255,
        required: true,
        trim: true,
        type: String
    },
    differences: {
        required: false,
        trim: true,
        type: String
    },
    includedMeals: {
        breakfast: {
            default: false,
            required: false,
            type: Boolean
        },
        dinner: {
            default: false,
            required: false,
            type: Boolean
        },
        lunch: {
            default: false,
            required: false,
            type: Boolean
        }
    }
})

const HotelLibrary = Library.discriminator(libraries.HOTEL, schema)

schema.pre('findOneAndUpdate', updateVersionKey)

export default HotelLibrary
