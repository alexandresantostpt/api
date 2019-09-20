import { cuisineTypes } from '@constants/cuisineTypes.const'
import { libraries } from '@constants/libraries.const'

import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Library from '../library/library.schema'

const schema = new mongoose.Schema({
    acceptsReservation: {
        default: true,
        required: false,
        type: Boolean
    },
    address: {
        maxlength: 255,
        required: true,
        trim: true,
        type: String
    },
    cuisine: {
        enum: cuisineTypes,
        maxlength: 15,
        required: true,
        trim: true,
        type: String
    },
    description: {
        required: true,
        trim: true,
        type: String
    },
    dressCode: {
        maxlength: 120,
        required: false,
        trim: true,
        type: String
    },
    facebookLink: {
        maxlength: 255,
        required: false,
        trim: true,
        type: String
    },
    instagramLink: {
        maxlength: 255,
        required: false,
        trim: true,
        type: String
    },
    michelinStars: {
        max: 3,
        min: 0,
        required: false,
        type: Number
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
    prizes: {
        maxlength: 255,
        required: false,
        trim: true,
        type: String
    },
    requiredReservation: {
        default: false,
        required: false,
        type: Boolean
    },
    site: {
        maxlength: 255,
        required: false,
        trim: true,
        type: String
    },
    suitableForChildren: {
        default: true,
        required: false,
        type: Boolean
    },
    vegetarian: {
        default: false,
        required: false,
        type: Boolean
    },
    workDays: {
        maxlength: 60,
        required: true,
        trim: true,
        type: Object
    }
})

const RestaurantLibrary = Library.discriminator(libraries.RESTAURANT, schema)

schema.pre('findOneAndUpdate', updateVersionKey)

export default RestaurantLibrary
