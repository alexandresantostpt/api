import * as mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        _by: {
            required: true,
            select: false,
            trim: true,
            type: String
        },
        any: {},
        deleted: {
            default: false,
            required: true,
            type: Boolean
        },
        library: {
            ref: 'Library',
            required: false,
            type: mongoose.Schema.Types.ObjectId
        },
        script: {
            ref: 'TravelScript',
            required: true,
            type: mongoose.Schema.Types.ObjectId
        },
        scriptDate: {
            required: true,
            type: Date
        }
    },
    {
        collection: 'services',
        discriminatorKey: 'type',
        timestamps: true
    }
)

const Service = mongoose.model('Service', schema)

export default Service
