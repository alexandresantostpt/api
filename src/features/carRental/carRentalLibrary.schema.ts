import { libraries } from '@/constants/libraries.const'

import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Library from '../library/library.schema'

const schema = new mongoose.Schema({
    isIncluded: {
        required: true,
        trim: true,
        type: String
    }
})

const CarRentalLibrary = Library.discriminator(libraries.CAR_RENTAL, schema)

schema.pre('findOneAndUpdate', updateVersionKey)

export default CarRentalLibrary
