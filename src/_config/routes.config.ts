import { routes as aerialRoutes } from '@features/aerial/aerial.routes'
import { routes as agencyRoutes } from '@features/agency/agency.routes'
import { routes as agencyUserRoutes } from '@features/agencyUser/agencyUser.routes'
import { routes as carRentalRoutes } from '@features/carRental/carRental.routes'
import { routes as categoryRoutes } from '@features/category/category.routes'
import { routes as cityRoutes } from '@features/city/city.routes'
import { routes as clientRoutes } from '@features/client/client.routes'
import { routes as cruiseRoutes } from '@features/cruise/cruise.routes'
import { routes as hotelRoutes } from '@features/hotel/hotel.routes'
import { routes as loginRoutes } from '@features/login/login.routes'
import { routes as notificationRoutes } from '@features/notification/notification.routes'
import { routes as programmingRoutes } from '@features/programming/programming.routes'
import { routes as resetRoutes } from '@features/reset/reset.routes'
import { routes as restaurantRoutes } from '@features/restaurant/restaurant.routes'
import { routes as taskRoutes } from '@features/task/task.routes'
import { routes as tipRoutes } from '@features/tip/tip.routes'
import { routes as tourRoutes } from '@features/tour/tour.routes'
import { routes as trainRoutes } from '@features/train/train.routes'
import { routes as transferRoutes } from '@features/transfer/transfer.routes'
import { routes as travelRoutes } from '@features/travel/travel.routes'
import { routes as travelScriptRoutes } from '@features/travelScript/travelScript.routes'
import { routes as userRoutes } from '@features/user/user.routes'
import { routes as weatherRoutes } from '@features/weather/weather.routes'
import { routes as libraryRoutes } from '@features/library/library.routes'

const routes = ({ server, serverHTTPS }) => {
    aerialRoutes(server)
    aerialRoutes(serverHTTPS)
    agencyRoutes(server)
    agencyRoutes(serverHTTPS)
    agencyUserRoutes(server)
    agencyUserRoutes(serverHTTPS)
    carRentalRoutes(server)
    carRentalRoutes(serverHTTPS)
    categoryRoutes(server)
    categoryRoutes(serverHTTPS)
    cityRoutes(server)
    cityRoutes(serverHTTPS)
    clientRoutes(server)
    clientRoutes(serverHTTPS)
    cruiseRoutes(server)
    cruiseRoutes(serverHTTPS)
    hotelRoutes(server)
    hotelRoutes(serverHTTPS)
    loginRoutes(server)
    loginRoutes(serverHTTPS)
    notificationRoutes(server)
    notificationRoutes(serverHTTPS)
    programmingRoutes(server)
    programmingRoutes(serverHTTPS)
    resetRoutes(server)
    resetRoutes(serverHTTPS)
    restaurantRoutes(server)
    restaurantRoutes(serverHTTPS)
    taskRoutes(server)
    taskRoutes(serverHTTPS)
    tipRoutes(server)
    tipRoutes(serverHTTPS)
    tourRoutes(server)
    tourRoutes(serverHTTPS)
    trainRoutes(server)
    trainRoutes(serverHTTPS)
    transferRoutes(server)
    transferRoutes(serverHTTPS)
    travelRoutes(server)
    travelRoutes(serverHTTPS)
    travelScriptRoutes(server)
    travelScriptRoutes(serverHTTPS)
    userRoutes(server)
    userRoutes(serverHTTPS)
    weatherRoutes(server)
    weatherRoutes(serverHTTPS)
    libraryRoutes(server)
    libraryRoutes(serverHTTPS)
    return { server, serverHTTPS }
}

export { routes }
