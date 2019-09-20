import { patterns } from '@constants/patterns'
import { roles } from '@features/user/constants'

import * as history from 'historical'
import * as mongoose from 'mongoose'
import * as validator from 'validator'

import { i18n } from '@i18n'

import { cryptPassword } from '@utils/auth.utils'
import { max } from '@utils/date.utils'
import { not } from '@utils/functions.utils'
import { updateVersionKey } from '@utils/model.utils'

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
        cpf: {
            match: patterns.CPF,
            maxlength: 14,
            minlength: 14,
            required: true,
            trim: true,
            type: String
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
            validate: {
                messsage: `{VALUE} ${i18n.t('validations.email')}`,
                validator: function(email) {
                    if (email) {
                        return validator.isEmail(email)
                    }
                    return true
                }
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
        role: {
            default: roles.CLIENT,
            enum: [roles.CLIENT],
            maxlength: 30,
            required: true,
            trim: true,
            type: String
        }
    },
    { timestamps: true }
)

schema.plugin(history)

schema.index(
    {
        agency: 1,
        cpf: 1,
        email: 1
    },
    { unique: true }
)

schema.methods.toObj = async function() {
    const dto = {
        _id: this._id,
        active: this.active,
        blocked: this.blocked,
        cpf: this.cpf,
        email: this.email,
        image: this.image,
        name: this.name,
        role: this.role
    }
    const expires = max().valueOf()
    return { dto, expires }
}

const Client = mongoose.model('Client', schema, 'clients')

schema.pre('findOneAndUpdate', updateVersionKey)

export default Client
