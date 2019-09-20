import { assistances, transfers } from '@features/transfer/constants'
import { libraries } from '@/constants/libraries.const'

import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Library from '../library/library.schema'

const schema = new mongoose.Schema({
    assistance: {
        enum: assistances,
        maxlength: 20,
        required: true,
        trim: true,
        type: String
    },
    luggageLimite: {
        min: 0,
        required: false,
        type: Number
    },
    transferType: {
        enum: transfers,
        maxlength: 20,
        required: true,
        trim: true,
        type: String
    }
})

const TransferLibrary = Library.discriminator(libraries.TRANSFER, schema)

schema.pre('findOneAndUpdate', updateVersionKey)

export default TransferLibrary
