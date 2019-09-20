import { crud } from '@utils/database.utils'
import { crudService } from '@utils/database.service.utils'
import { services } from '@/constants/services.const'

import TipService from '@features/tip/tipService.schema'

const { del, download, getFields } = crud(TipService)
const { create, get, getAll, update, uploadToLibrary } = crudService(TipService, services.TIP)

export { create, del, download, get as edit, getAll, getFields, update, uploadToLibrary as upload }
