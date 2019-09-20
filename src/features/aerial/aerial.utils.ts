import { config } from '@config/config'

import * as fetch from 'node-fetch'
import * as moment from 'moment'

import { i18n } from '@i18n'

import Client from '../client/client.schema'
import Notification from '@features/notification/notification.schema'

const createNotifications = async (doc: any, operation: string) => {
    doc.journeys.forEach(journey => {
        journey.passengers.forEach(async passenger => {
            const client = await Client.findOne({ _id: passenger.client }).lean()
            await Notification.create({
                body: `${i18n.t('messages.push.aerial', { lng: 'pt' })} ${moment(journey.from.hour)
                    .utc(false)
                    .hour()}h`,
                data: doc,
                date: await doc.pushDate,
                title: i18n.t('titles.push.near', { lng: 'pt' }),
                topic: client.cpf
            })
            await Notification.create({
                body: i18n.t(`messages.push.${operation}.aerial`, { destiny: journey.from.city, lng: 'pt' }),
                data: doc,
                date: moment().format(),
                operation,
                title: i18n.t(`titles.push.${operation}`, { lng: 'pt' }),
                topic: client.cpf
            })
        })
    })
}

const getFlightStatus = (flightCarrier: string, flightNumber: string, flightYear: number, flightMonth: number, flightDay: number) =>
    fetch(
        `${
            config.services.aerial.url
        }/flight/status/${flightCarrier}/${flightNumber}/dep/${flightYear}/${flightMonth}/${flightDay}?appId=${
            config.services.aerial.appId
        }&appKey=${config.services.aerial.appKey}&utc=true`
    ).then(resp => resp.json())

const getFlightTrack = (flightCarrier: string, flightNumber: string, flightYear: number, flightMonth: number, flightDay: number) =>
    fetch(
        `${
            config.services.aerial.url
        }/flight/tracks/${flightCarrier}/${flightNumber}/dep/${flightYear}/${flightMonth}/${flightDay}?appId=${
            config.services.aerial.appId
        }&appKey=${config.services.aerial.appKey}&utc=true`
    ).then(resp => resp.json())

const toStatusDTO = (statusResponse: any): any => {
    const dto = { flightStatus: [] }
    if (statusResponse) {
        const { flightStatuses } = statusResponse
        if (flightStatuses.length) {
            flightStatuses.forEach(flightStatus => {
                const { airportResources = {}, arrivalDate = {}, departureDate = {}, delays = {} } = flightStatus
                const { dateUtc: arrivalDateUtc } = arrivalDate
                const { dateUtc: departureDateUtc } = departureDate
                const { arrivalGate, arrivalTerminal, departureGate, departureTerminal } = airportResources
                const { arrivalGateDelayMinutes, departureGateDelayMinutes } = delays
                dto.flightStatus.push({
                    arrivalDate: arrivalDateUtc,
                    arrivalGate,
                    arrivalGateDelayMinutes,
                    arrivalTerminal,
                    departureDate: departureDateUtc,
                    departureGate,
                    departureGateDelayMinutes,
                    departureTerminal
                })
            })
        }
    }
    return dto
}

const toTrackDTO = (trackResponse: any): any => {
    const { appendix, flightTracks, request } = trackResponse
    const {
        airline: { requestedCode },
        airport,
        date: { interpreted },
        flight: { requested }
    } = request
    const { airlines, airports } = appendix
    const dto = {
        airline: requestedCode,
        airlines,
        airport,
        airports,
        date: interpreted,
        flight: requested,
        flightTracks
    }
    return dto
}

export { createNotifications, getFlightStatus, getFlightTrack, toStatusDTO, toTrackDTO }
