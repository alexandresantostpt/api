import { Model, Document } from 'mongoose'
import { services } from '@/constants/services.const'
import AerialService from '@/features/aerial/aerialService.schema'
import CarRentalService from '@/features/carRental/carRentalService.schema'
import CruiseService from '@/features/cruise/cruiseService.schema'
import HotelService from '@/features/hotel/hotelService.schema'
import Programming from '@/features/programming/programmingService.schema'
import RestaurantService from '@/features/restaurant/restaurantService.schema'
import TipService from '@/features/tip/tipService.schema'
import TourService from '@/features/tour/tourService.schema'
import Train from '@/features/train/trainService.schema'
import TransferService from '@/features/transfer/transferService.schema'

class SchemaFactory {
    private readonly factory = {
        [services.AERIAL]: AerialService,
        [services.CAR_RENTAL]: CarRentalService,
        [services.CRUISE]: CruiseService,
        [services.HOTEL]: HotelService,
        [services.PROGRAMMING]: Programming,
        [services.RESTAURANT]: RestaurantService,
        [services.TIP]: TipService,
        [services.TOUR]: TourService,
        [services.TRAIN]: Train,
        [services.TRANSFER]: TransferService
    }

    public get = (serviceType: services): Model<Document> => {
        const instance = this.factory[serviceType]
        if (instance === undefined) {
            throw Error(`No service defined for '${serviceType}'`)
        }
        return instance
    }
}

const ServiceFactory = new SchemaFactory()

export default ServiceFactory
