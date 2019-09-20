import { libraries } from '@/constants/libraries.const'
import { tourTypes } from '@features/tour/constants'

import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Library from '../library/library.schema'

const schema = new mongoose.Schema({
    describe: {
        required: true,
        trim: true,
        type: String
    },
    duration: {
        maxlength: 15,
        required: true,
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
    },
    language: {
        maxlength: 30,
        required: true,
        trim: true,
        type: String
    },
    phoneNumber: {
        maxlength: 30,
        required: false,
        type: String
    },
    site: {
        maxlength: 255,
        required: false,
        trim: true,
        type: String
    },
    tourType: {
        enum: tourTypes,
        maxlength: 20,
        required: true,
        trim: true,
        type: String
    }
})

const TourLibrary = Library.discriminator(libraries.TOUR, schema)

schema.pre('findOneAndUpdate', updateVersionKey)

export default TourLibrary
