import { Model, Document } from 'mongoose'
import { libraries } from '@/constants/libraries.const'
import AerialLibrary from '@/features/aerial/aerialLibrary.schema'
import CarRentalLibrary from '@/features/carRental/carRentalLibrary.schema'
import CruiseLibrary from '@/features/cruise/cruiseLibrary.schema'
import HotelLibrary from '@/features/hotel/hotelLibrary.schema'
import RestaurantLibrary from '@/features/restaurant/restaurantLibrary.schema'
import TipLibrary from '@/features/tip/tipLibrary.schema'
import TourLibrary from '@/features/tour/tourLibrary.schema'
import TrainLibrary from '@features/train/trainLibrary.schema'
import TransferLibrary from '@/features/transfer/transferLibrary.schema'

class SchemaFactory {
    private readonly factory = {
        [libraries.AERIAL]: AerialLibrary,
        [libraries.CAR_RENTAL]: CarRentalLibrary,
        [libraries.CRUISE]: CruiseLibrary,
        [libraries.HOTEL]: HotelLibrary,
        [libraries.PROGRAMMING]: undefined,
        [libraries.RESTAURANT]: RestaurantLibrary,
        [libraries.TIP]: TipLibrary,
        [libraries.TOUR]: TourLibrary,
        [libraries.TRAIN]: TrainLibrary,
        [libraries.TRANSFER]: TransferLibrary
    }

    public get = (serviceType: libraries): Model<Document> => {
        const instance = this.factory[`LIBRARY_${serviceType}`]
        if (instance === undefined) {
            throw Error(`No library defined for '${serviceType}'`)
        }
        return instance
    }
}

const LibraryFactory = new SchemaFactory()

export default LibraryFactory
