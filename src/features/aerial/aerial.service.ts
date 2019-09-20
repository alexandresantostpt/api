import { services } from '@/constants/services.const'

import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'

import AerialService from './aerialService.schema'

const { del, download, getFields } = crud(AerialService)
const { create, get, getAll, update, uploadToLibrary } = crudService(AerialService, services.AERIAL)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
