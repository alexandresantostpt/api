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
        code: {
            maxlength: 255,
            required: true,
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
        legend: {
            maxlength: 120,
            required: false,
            trim: true,
            type: String
        },
        legendCode: {
            maxlength: 255,
            required: false,
            trim: true,
            type: String
        },
        subCategories: [
            {
                code: {
                    maxlength: 255,
                    required: true,
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
                fields: [
                    {
                        component: {
                            maxlength: 10,
                            required: true,
                            trim: true,
                            type: String
                        },
                        id: {
                            maxlength: 30,
                            required: true,
                            trim: true,
                            type: String
                        },
                        label: {
                            maxlength: 255,
                            required: true,
                            trim: true,
                            type: String
                        },
                        maxLength: {
                            min: 0,
                            required: false,
                            type: Number
                        },
                        name: {
                            maxlength: 120,
                            required: true,
                            trim: true,
                            type: String
                        },
                        options: {
                            required: false,
                            type: Array
                        },
                        padding: {
                            default: false,
                            required: false,
                            type: Boolean
                        },
                        rateType: {
                            maxlength: 255,
                            required: false,
                            trim: true,
                            type: String
                        },
                        required: {
                            default: false,
                            required: true,
                            type: Boolean
                        },
                        type: {
                            maxlength: 15,
                            required: true,
                            trim: true,
                            type: String
                        },
                        value: {
                            maxlength: 15,
                            required: false,
                            trim: true,
                            type: String
                        }
                    }
                ],
                legend: {
                    maxlength: 120,
                    required: false,
                    trim: true,
                    type: String
                },
                legendCode: {
                    maxlength: 255,
                    required: false,
                    trim: true,
                    type: String
                }
            }
        ]
    },
    { timestamps: true }
)

schema.plugin(history)

const Category = mongoose.model('Category', schema, 'categories')

schema.pre('findOneAndUpdate', updateVersionKey)

export default Category
