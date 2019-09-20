import { crud } from '@utils/database.utils'

import Category from './category.schema'

const { create, del, edit, getAll, getFields, update } = crud(Category)

export { create, del, edit, getAll, getFields, update }
