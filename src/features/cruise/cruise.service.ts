import { services } from '@/constants/services.const'

import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'

import CruiseService from './cruiseService.schema'

const { del, download, getFields } = crud(CruiseService)
const { create, get, getAll, update, uploadToLibrary } = crudService(CruiseService, services.CRUISE)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
