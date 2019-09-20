import { patterns } from '@constants/patterns'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'

const schema = new mongoose.Schema(
    {
        _by: {
            required: true,
            select: false,
            trim: true,
            type: String
        },
        appTheme: {
            required: false,
            trim: true,
            type: Object
        },
        businessName: {
            maxlength: 120,
            required: false,
            trim: true,
            type: String
        },
        cnpj: {
            match: patterns.CNPJ,
            maxlength: 18,
            required: true,
            trim: true,
            type: String,
            unique: true
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
        phoneContact: {
            maxlength: 30,
            required: false,
            trim: true,
            type: String
        },
        phoneEmergency: {
            maxlength: 30,
            required: false,
            trim: true,
            type: String
        },
        socialName: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        }
    },
    { timestamps: true }
)

schema.plugin(history)

const Agency = mongoose.model('Agency', schema, 'agencies')

schema.pre('findOneAndUpdate', updateVersionKey)

export default Agency
