import { crons } from '@constants/crons.const'
import { dates } from '@constants/dates.const'
import { patterns } from '@/constants/patterns'

import * as moment from 'moment'
import * as mongoose from 'mongoose'
import * as schedule from 'node-schedule'

import { i18n } from '@i18n'

import { getFlightStatus, toStatusDTO } from './aerial.utils'
import { not } from '@utils/functions.utils'
import { sendNotification } from '@/utils/firebase.utils'

import AerialService from './aerialService.schema'
import Client from '@features/client/client.schema'
import TravelScript from '@features/travelScript/travelScript.schema'
import { isEquals, joinHour } from '@/utils/date.utils'

const checkAerialStatus = () => {
    const oneWeek = 7
    let firstRequest = true
    let nextRequest = moment()
    schedule.scheduleJob(crons.EVERY_MINUTE, async () => {
        const aerials = await AerialService.find()
        const today = firstRequest ? nextRequest.clone() : moment()
        let hasChanges = false
        if (aerials.length) {
            aerials.forEach(async (aerial: any) => {
                const script = await TravelScript.findOne({ _id: mongoose.Types.ObjectId(aerial.script) })
                    .populate('travel')
                    .lean()
                if (not(script.deleted) && not(script.travel.archived) && not(script.travel.deleted) && script.travel.closed) {
                    if (isEquals(today, nextRequest)) {
                        Promise.all(
                            aerial.journeys.map(async (journey: any) => {
                                const { from, to, flightNumber } = journey
                                const fromDate = joinHour(from.date.toISOString(), from.hour.toISOString()).add(4, 'h')
                                const toDate = joinHour(to.date.toISOString(), to.hour.toISOString()).add(4, 'h')
                                const remainingFromDays = fromDate.diff(today, 'days')
                                const remainingFromHours = fromDate.diff(today, 'hours')
                                const remainingToHours = toDate.diff(today, 'hours')
                                if (
                                    remainingFromDays <= oneWeek &&
                                    remainingToHours < 4 &&
                                    patterns.FLIGHT_NUMBER.test(flightNumber)
                                ) {
                                    const [carrier, number] = flightNumber.split(' ')
                                    const date = moment(journey.from.date).utc(false)
                                    const year = date.year()
                                    const month = date.month() + 1
                                    const day = date.date()
                                    const status = await getFlightStatus(carrier, number, year, month, day)
                                    const { flightStatus } = toStatusDTO(status)
                                    flightStatus.forEach(
                                        ({
                                            arrivalDate,
                                            arrivalGate,
                                            arrivalGateDelayMinutes,
                                            arrivalTerminal,
                                            departureDate,
                                            departureGate,
                                            departureGateDelayMinutes,
                                            departureTerminal
                                        }) => {
                                            // tslint:disable
                                            if (journey.from.date.toISOString() !== departureDate) {
                                                hasChanges = true
                                                journey.from.date = departureDate
                                            }
                                            if (journey.from.delayMinutes !== departureGateDelayMinutes) {
                                                hasChanges = true
                                                journey.from.delayMinutes = departureGateDelayMinutes
                                            }
                                            if (journey.from.gate !== departureGate) {
                                                hasChanges = true
                                                journey.from.gate = departureGate
                                            }
                                            if (journey.from.terminal !== departureTerminal) {
                                                hasChanges = true
                                                journey.from.terminal = departureTerminal
                                            }
                                            if (journey.from.hour.toISOString() !== departureDate) {
                                                hasChanges = true
                                                journey.from.hour = departureDate
                                            }
                                            if (journey.to.date.toISOString() !== arrivalDate) {
                                                hasChanges = true
                                                journey.to.date = arrivalDate
                                            }
                                            if (journey.to.delayMinutes !== arrivalGateDelayMinutes) {
                                                hasChanges = true
                                                journey.to.delayMinutes = arrivalGateDelayMinutes
                                            }
                                            if (journey.to.gate !== arrivalGate) {
                                                hasChanges = true
                                                journey.to.gate = arrivalGate
                                            }
                                            if (journey.to.terminal !== arrivalTerminal) {
                                                hasChanges = true
                                                journey.to.terminal = arrivalTerminal
                                            }
                                            if (journey.to.hour.toISOString() !== arrivalDate) {
                                                hasChanges = true
                                                journey.to.hour = arrivalDate
                                            }
                                            return journey
                                            // tslint:enable
                                        }
                                    )
                                }
                                if (remainingFromDays > 1) {
                                    nextRequest = nextRequest.add(6, 'h')
                                } else if (remainingFromHours > 6) {
                                    nextRequest = nextRequest.add(1, 'h')
                                } else if (remainingFromHours < 6) {
                                    nextRequest = nextRequest.add(1, 'm')
                                }
                            })
                        ).then(() => {
                            if (hasChanges) {
                                aerial.journeys.forEach(journey => {
                                    journey.passengers.forEach(async passenger => {
                                        const client = await Client.findOne({ _id: mongoose.Types.ObjectId(passenger.client) }).lean()
                                        sendNotification(
                                            i18n.t('messages.push.aerialUpdate', { lng: 'pt' }),
                                            i18n.t('titles.push.diff', { lng: 'pt' }),
                                            client.cpf,
                                            {
                                                scriptId: script._id.toString(),
                                                serviceId: aerial._id.toString(),
                                                travelId: script.travel._id.toString()
                                            }
                                        )
                                    })
                                })
                            }
                            aerial.save()
                        })
                    }
                }
            })
        }
        firstRequest = false
    })
}

export { checkAerialStatus }
