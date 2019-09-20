import { libraries } from '@/constants/libraries.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Library from '../library/library.schema'

const schema = new mongoose.Schema({
    address: {
        maxlength: 255,
        required: false,
        trim: true,
        type: String
    },
    category: {
        maxlength: 60,
        required: true,
        trim: true,
        type: String
    },
    describe: {
        required: true,
        trim: true,
        type: String
    },
    subCategory: {
        maxlength: 60,
        required: true,
        trim: true,
        type: String
    }
})

schema.plugin(history)

const TipLibrary = Library.discriminator(libraries.TIP, schema)

schema.pre('findOneAndUpdate', updateVersionKey)

export default TipLibrary
