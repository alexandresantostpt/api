import { libraries } from '@constants/libraries.const'

import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'
import Library from '../library/library.schema'

const schema = new mongoose.Schema()

const AerialLibrary = Library.discriminator(libraries.AERIAL, schema)

schema.pre('findOneAndUpdate', updateVersionKey)

export default AerialLibrary
