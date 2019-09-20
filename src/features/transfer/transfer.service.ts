import { services } from '@/constants/services.const'

import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'

import TransferService from './transferService.schema'

const { del, download, getFields } = crud(TransferService)
const { create, get, getAll, update, uploadToLibrary } = crudService(TransferService, services.TRANSFER)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
