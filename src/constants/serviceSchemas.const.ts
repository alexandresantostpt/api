import { services } from './services.const'

import Aerial from '@features/aerial/aerialService.schema'
import CarRental from '@features/carRental/carRentalService.schema'
import Cruise from '@features/cruise/cruiseService.schema'
import Hotel from '@features/hotel/hotelService.schema'
import Programming from '@/features/programming/programmingService.schema'
import Restaurant from '@features/restaurant/restaurantService.schema'
import Tip from '@features/tip/tipService.schema'
import Tour from '@features/tour/tourService.schema'
import Train from '@features/train/trainService.schema'
import Transfer from '@features/transfer/transferService.schema'

const serviceSchemas = {
    [services.AERIAL]: Aerial,
    [services.CAR_RENTAL]: CarRental,
    [services.CRUISE]: Cruise,
    [services.HOTEL]: Hotel,
    [services.PROGRAMMING]: Programming,
    [services.RESTAURANT]: Restaurant,
    [services.TIP]: Tip,
    [services.TOUR]: Tour,
    [services.TRAIN]: Train,
    [services.TRANSFER]: Transfer
}

export { serviceSchemas }
