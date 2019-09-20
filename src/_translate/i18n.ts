import * as i18next from 'i18next'

import { messages } from './languages/'

const i18n = i18next.init({
    debug: false,
    defaultNS: 'translations',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    },
    ns: ['translations'],
    resources: messages
})

export { i18n }
