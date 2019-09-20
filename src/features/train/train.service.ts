import { services } from '@/constants/services.const'

import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'

import TrainService from './trainService.schema'

const { del, download, getFields } = crud(TrainService)
const { create, get, getAll, update, uploadToLibrary } = crudService(TrainService, services.TRAIN)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
