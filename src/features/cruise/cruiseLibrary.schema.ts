import { libraries } from '@/constants/libraries.const'

import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Library from '../library/library.schema'

const schema = new mongoose.Schema({
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
    }
})

const CruiseLibrary = Library.discriminator(libraries.CRUISE, schema)

schema.pre('findOneAndUpdate', updateVersionKey)

export default CruiseLibrary
