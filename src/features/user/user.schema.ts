import { patterns } from '@constants/patterns'
import { ROLES } from './constants'

import * as history from 'historical'
import * as moment from 'moment'
import * as mongoose from 'mongoose'
import * as validator from 'validator'

import { i18n } from '@i18n'

import { cryptPassword } from '@utils/auth.utils'
import { not } from '@utils/functions.utils'
import { updateVersionKey } from '@utils/model.utils'

import Agency from '@features/agency/agency.schema'

const schema = new mongoose.Schema(
    {
        _by: {
            required: true,
            select: false,
            trim: true,
            type: String
        },
        active: {
            default: false,
            required: true,
            type: Boolean
        },
        agency: {
            ref: 'Agency',
            required: true,
            type: mongoose.Schema.Types.ObjectId
        },
        blocked: {
            default: false,
            required: true,
            type: Boolean
        },
        cellPhone: {
            maxlength: 30,
            required: false,
            trim: true,
            type: String
        },
        cpf: {
            match: patterns.CPF,
            maxlength: 14,
            minlength: 14,
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
        email: {
            lowercase: true,
            maxlength: 255,
            required: true,
            trim: true,
            type: String,
            unique: true,
            validate: {
                messsage: `{VALUE} ${i18n.t('validations.email')}`,
                validator: validator.isEmail
            }
        },
        image: {
            maxlength: 255,
            required: false,
            trim: true,
            type: String
        },
        lastAccess: {
            default: new Date(),
            required: true,
            type: Date
        },
        name: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        password: {
            default: function() {
                let cpf = this.cpf
                if (not(this.__v)) {
                    cpf = cpf.replace(/([.-])/g, '')
                }
                return cryptPassword(cpf, this.email)
            },
            maxlength: 255,
            required: true,
            select: false,
            trim: true,
            type: String
        },
        phone: {
            maxlength: 30,
            required: false,
            trim: true,
            type: String
        },
        role: {
            enum: ROLES,
            maxlength: 30,
            required: true,
            trim: true,
            type: String
        }
    },
    { timestamps: true }
)

schema.plugin(history)

schema.methods.toObj = async function() {
    const agency = await Agency.findOne({ _id: this.agency }).lean()
    const dto = {
        _id: this._id,
        active: this.active,
        agency: agency._id,
        blocked: this.blocked,
        cellPhone: this.cellPhone,
        cpf: this.cpf,
        email: this.email,
        logo: agency.image,
        name: this.name,
        role: this.role,
        theme: agency.appTheme || {}
    }
    const expires = moment()
        .add(1, 'd')
        .valueOf()
    return { dto, expires }
}

const User = mongoose.model('User', schema, 'users')

schema.pre('findOneAndUpdate', updateVersionKey)

export default User
