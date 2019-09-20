import { services } from '@/constants/services.const'

import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'

import HotelService from './hotelService.schema'

const { del, download, getFields } = crud(HotelService)
const { create, get, getAll, update, uploadToLibrary } = crudService(HotelService, services.HOTEL)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
