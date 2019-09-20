import * as mongoose from 'mongoose'

const CitySchema = new mongoose.Schema({
    id: {
        maxlength: 255,
        required: false,
        trim: true,
        type: String
    },
    name: {
        maxlength: 120,
        required: false,
        trim: true,
        type: String
    },
    timezone: {
        maxlength: 30,
        required: false,
        trim: true,
        type: String
    }
})

export default CitySchema
