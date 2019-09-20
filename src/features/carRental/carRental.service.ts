import { services } from '@/constants/services.const'

import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'

import CarRentalService from './carRentalService.schema'

const { del, download, getFields } = crud(CarRentalService)
const { create, get, getAll, update, uploadToLibrary } = crudService(CarRentalService, services.CAR_RENTAL)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
