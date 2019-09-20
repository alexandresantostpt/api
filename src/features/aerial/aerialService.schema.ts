import { minutes } from '@constants/times.const'
import { operations } from '@/constants/operations.const'
import { patterns } from '@/constants/patterns'
import { services } from '@constants/services.const'

import * as history from 'historical'
import * as mongoose from 'mongoose'

import { createPushDate } from '@utils/date.utils'
import { createNotifications } from './aerial.utils'
import { not } from '@utils/functions.utils'
import { removingMissingClients } from '@/utils/service.utils'
import { updateVersionKey } from '@utils/model.utils'

import Notification from '@features/notification/notification.schema'
import Service from '../service/service.schema'

const schema = new mongoose.Schema({
    journeys: [
        {
            companyName: {
                maxlength: 120,
                required: true,
                trim: true,
                type: String
            },
            flightNumber: {
                match: patterns.FLIGHT_NUMBER,
                maxlength: 15,
                required: true,
                trim: true,
                type: String
            },
            from: {
                airport: {
                    maxlength: 60,
                    required: true,
                    trim: true,
                    type: String
                },
                city: {
                    maxlength: 120,
                    required: true,
                    trim: true,
                    type: String
                },
                date: {
                    required: true,
                    type: Date
                },
                delayMinutes: {
                    min: 0,
                    required: false,
                    type: Number
                },
                gate: {
                    maxlength: 15,
                    required: false,
                    trim: true,
                    type: String
                },
                hour: {
                    required: true,
                    type: Date
                },
                terminal: {
                    maxlength: 15,
                    required: false,
                    trim: true,
                    type: String
                }
            },
            passengers: [
                {
                    client: {
                        ref: 'Client',
                        required: true,
                        type: mongoose.Schema.Types.ObjectId
                    },
                    reserveCode: {
                        maxlength: 15,
                        required: false,
                        trim: true,
                        type: String
                    },
                    seat: {
                        maxlength: 15,
                        required: false,
                        trim: true,
                        type: String
                    },
                    session: {
                        maxlength: 15,
                        required: false,
                        trim: true,
                        type: String
                    },
                    ticket: {
                        min: 0,
                        required: false,
                        type: Number
                    }
                }
            ],
            to: {
                airport: {
                    maxlength: 60,
                    required: true,
                    trim: true,
                    type: String
                },
                city: {
                    maxlength: 120,
                    required: true,
                    trim: true,
                    type: String
                },
                date: {
                    required: true,
                    type: Date
                },
                delayMinutes: {
                    min: 0,
                    required: false,
                    type: Number
                },
                gate: {
                    maxlength: 15,
                    required: false,
                    trim: true,
                    type: String
                },
                hour: {
                    required: true,
                    type: Date
                },
                terminal: {
                    maxlength: 15,
                    required: false,
                    trim: true,
                    type: String
                }
            }
        }
    ]
})

schema.plugin(history)

schema.methods.checkClients = function(newClients: any) {
    this.journeys.map(journey => {
        journey.passengers = removingMissingClients(journey.passengers, newClients, this._id, 'client')
        return journey
    })
}

schema.virtual('pushDate').get(async function() {
    const firstJourney = this.journeys[0]
    return createPushDate(this.script, this.scriptDate, firstJourney.from.date, firstJourney.from.hour, minutes.FOUR_HOURS)
})

schema.pre('findOneAndUpdate', updateVersionKey)

schema.post('findOneAndUpdate', async function(doc: any) {
    await Notification.deleteMany({ 'data._id': mongoose.Types.ObjectId(doc._id) })
    if (not(doc.deleted)) {
        await createNotifications(doc, operations.UPDATE)
    }
})

schema.post('save', async function(doc: any) {
    await createNotifications(doc, operations.INSERT)
})

const AerialService = Service.discriminator(services.AERIAL, schema)

export default AerialService
