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
        deleted: {
            default: false,
            required: true,
            type: Boolean
        },
        describe: {
            required: true,
            trim: true,
            type: String
        },
        done: {
            default: false,
            required: true,
            type: Boolean
        },
        user: {
            ref: 'User',
            required: true,
            type: mongoose.Types.ObjectId
        }
    },
    { timestamps: true }
)

schema.plugin(history)

const Task = mongoose.model('Task', schema, 'tasks')

schema.pre('findOneAndUpdate', updateVersionKey)

export default Task
