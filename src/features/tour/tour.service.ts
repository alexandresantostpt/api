import { services } from '@/constants/services.const'

import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'

import TourService from './tourService.schema'

const { del, download, getFields } = crud(TourService)
const { create, get, getAll, update, uploadToLibrary } = crudService(TourService, services.TOUR)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
