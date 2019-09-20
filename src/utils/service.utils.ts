import { services } from '@constants/services.const'

import * as moment from 'moment'

import Notification from '@features/notification/notification.schema'
import TravelScript from '@/features/travelScript/travelScript.schema'

const checkDateBetweenTravelRange = async (scriptId, serviceDay) => {
    const travelScript = await TravelScript.findOne({ _id: scriptId })
        .populate('travel')
        .lean()

    const { travelStartDate, travelEndDate } = travelScript.travel
    const startDate = moment(travelStartDate).utc(false)
    const endDate = moment(travelEndDate).utc(false)

    return moment(serviceDay)
        .utc(false)
        .isBetween(startDate, endDate, 'day', '[]')
}

const filterServicesByClient = (clientIdToFilter: string, servicesToFilter: any) =>
    servicesToFilter.filter(service => {
        switch (service.type) {
            case services.AERIAL:
                return service.journeys.some(journey =>
                    journey.passengers.some(passenger => passenger.client.toString() === clientIdToFilter)
                )
            case services.CRUISE:
            case services.HOTEL:
            case services.TOUR:
            case services.TRANSFER:
                return service.passengers.some(passengerId => passengerId.toString() === clientIdToFilter)
            case services.CAR_RENTAL:
                return service.passengerResponsible.some(passengerId => passengerId.toString() === clientIdToFilter)
            case services.RESTAURANT:
                return service.clients.some(clientId => clientId.toString() === clientIdToFilter)
            case services.TRAIN:
                return service.passengers.some(passenger => passenger.client.toString() === clientIdToFilter)
            default:
                return true
        }
    })

const removingMissingClients = (from: any, filters: any, idService: any, key = null) => {
    Notification.findOneAndDelete({ 'data._id': idService })
    return from.filter(item => filters.includes(key ? item[key].toString() : item.toString()))
}

export { checkDateBetweenTravelRange, filterServicesByClient, removingMissingClients }
