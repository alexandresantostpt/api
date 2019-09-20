import { services } from '@/constants/services.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    describe: {
        required: true,
        trim: true,
        type: String
    }
})

schema.plugin(history)

schema.pre('findOneAndUpdate', updateVersionKey)

const Programming = Service.discriminator(services.PROGRAMMING, schema)

export default Programming
