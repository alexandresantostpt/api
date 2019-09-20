import { notificationStatus } from './constants'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { updateVersionKey } from '@utils/model.utils'

const schema = new mongoose.Schema(
    {
        body: {
            required: true,
            trim: true,
            type: String
        },
        data: {
            required: false,
            type: Object
        },
        date: {
            required: true,
            type: Date
        },
        deleted: {
            default: false,
            required: true,
            type: Boolean
        },
        operation: {
            maxlength: 10,
            required: false,
            trim: true,
            type: String
        },
        read: [
            {
                readAt: {
                    required: false,
                    type: Date
                },
                readBy: {
                    required: false,
                    type: String
                }
            }
        ],
        status: {
            default: notificationStatus.PENDING,
            enum: [notificationStatus.PENDING, notificationStatus.SENT],
            maxlength: 10,
            required: true,
            trim: true,
            type: String
        },
        title: {
            maxlength: 120,
            required: true,
            trim: true,
            type: String
        },
        topic: {
            maxlength: 60,
            required: true,
            trim: true,
            type: String
        }
    },
    { timestamps: true }
)

schema.plugin(history)

const Notification = mongoose.model('Notification', schema, 'notifications')

schema.pre('findOneAndUpdate', updateVersionKey)

export default Notification
