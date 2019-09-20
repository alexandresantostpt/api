import { services } from '@/constants/services.const'

import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Service from '@features/service/service.schema'

const schema = new mongoose.Schema({
    libraries: [
        {
            ref: 'Library',
            required: false,
            type: mongoose.Schema.Types.ObjectId
        }
    ]
})

schema.pre('findOneAndUpdate', updateVersionKey)

const TipService = Service.discriminator(services.TIP, schema)

export default TipService
