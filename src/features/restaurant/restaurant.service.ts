import { services } from '@/constants/services.const'

import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'

import RestaurantService from './restaurantService.schema'

const { del, download, getFields } = crud(RestaurantService)
const { create, get, getAll, update, uploadToLibrary } = crudService(RestaurantService, services.RESTAURANT)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
