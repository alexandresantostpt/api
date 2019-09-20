const cuisineTypes = [
    'Argentina',
    'Asiatica',
    'Creole',
    'Indiana',
    'Libanesa',
    'Otomana',
    'Tailandesa',
    'Vegetariana',
    'Fusao',
    'Alema',
    'Brasileira',
    'Espanhola',
    'Inglesa',
    'Marroquina',
    'Peruana',
    'Vietnamita',
    'Internacional',
    'Americana',
    'Chinesa',
    'Francesa',
    'Italiana',
    'Mediterranea',
    'Pizzaria',
    'FrutosDoMar',
    'TipicaLocal',
    'Arabe',
    'Coreana',
    'Grega',
    'Japonesa',
    'Mexicana',
    'Portuguesa',
    'Contemporanea'
]

const eventsFields = [
    {
        component: 'input',
        id: 'city',
        label: 'city',
        maxLength: 120,
        name: 'library.city',
        required: true,
        type: 'city',
        value: 'object'
    },
    {
        component: 'input',
        id: 'name',
        label: 'name',
        maxLength: 120,
        name: 'library.name',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'describe',
        label: 'describe',
        maxLength: 255,
        name: 'library.describe',
        padding: true,
        required: true,
        type: 'textarea'
    },
    {
        component: 'input',
        id: 'dateStart',
        label: 'dateStart',
        name: 'library.any.dateStart',
        required: false,
        type: 'date'
    },
    {
        component: 'input',
        id: 'dateEnd',
        label: 'dateEnd',
        name: 'library.any.dateEnd',
        padding: true,
        required: false,
        type: 'date'
    },
    {
        component: 'input',
        id: 'recorrency',
        label: 'recorrency',
        maxLength: 30,
        name: 'library.any.recorrency',
        options: ['monthly', 'yearly', 'biennial', 'punctual'],
        padding: true,
        required: false,
        type: 'radio'
    },
    {
        component: 'input',
        id: 'address',
        label: 'address',
        maxLength: 120,
        name: 'library.address',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'site',
        label: 'site',
        maxLength: 120,
        name: 'library.any.site',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'suitableForChildren',
        label: 'suitableForChildren',
        name: 'library.any.suitableForChildren',
        options: ['yes', 'no'],
        required: false,
        type: 'radio'
    }
]

const nightlifeFields = [
    {
        component: 'input',
        id: 'city',
        label: 'city',
        maxLength: 120,
        name: 'library.city',
        required: true,
        type: 'city',
        value: 'object'
    },
    {
        component: 'input',
        id: 'name',
        label: 'name',
        maxLength: 120,
        name: 'library.name',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'describe',
        label: 'describe',
        maxLength: 255,
        name: 'library.describe',
        padding: true,
        required: true,
        type: 'textarea'
    },
    {
        component: 'input',
        id: 'hourStart',
        label: 'hourStart',
        name: 'library.any.hourStart',
        required: true,
        type: 'time'
    },
    {
        component: 'input',
        id: 'hourEnd',
        label: 'hourEnd',
        name: 'library.any.hourEnd',
        required: true,
        type: 'time'
    },
    {
        component: 'input',
        id: 'workDays',
        label: 'workDays',
        name: 'library.any.workDays',
        padding: true,
        required: true,
        type: 'operationDays'
    },
    {
        component: 'input',
        id: 'address',
        label: 'address',
        maxLength: 120,
        name: 'library.address',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'phone',
        label: 'phone',
        maxLength: 30,
        name: 'library.any.phone',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'site',
        label: 'site',
        maxLength: 255,
        name: 'library.any.site',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'facebook',
        label: 'facebook',
        maxLength: 255,
        name: 'library.any.facebook',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'instagram',
        label: 'instagram',
        maxLength: 255,
        name: 'library.any.instagram',
        required: false,
        type: 'text'
    }
]

const tourFields = [
    {
        component: 'input',
        id: 'city',
        label: 'city',
        maxLength: 120,
        name: 'library.city',
        required: true,
        type: 'city',
        value: 'object'
    },
    {
        component: 'input',
        id: 'name',
        label: 'name',
        maxLength: 120,
        name: 'library.name',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'describe',
        label: 'describe',
        maxLength: 255,
        name: 'library.describe',
        padding: true,
        required: true,
        type: 'textarea'
    },
    {
        component: 'input',
        id: 'hourStart',
        label: 'hourStart',
        name: 'library.any.hourStart',
        required: true,
        type: 'time'
    },
    {
        component: 'input',
        id: 'hourEnd',
        label: 'hourEnd',
        name: 'library.any.hourEnd',
        required: true,
        type: 'time'
    },
    {
        component: 'input',
        id: 'workDays',
        label: 'workDays',
        name: 'library.any.workDays',
        padding: true,
        required: true,
        type: 'operationDays'
    },
    {
        component: 'input',
        id: 'address',
        label: 'address',
        maxLength: 120,
        name: 'library.address',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'phone',
        label: 'phone',
        maxLength: 30,
        name: 'library.any.phone',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'site',
        label: 'site',
        maxLength: 255,
        name: 'library.any.site',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'facebook',
        label: 'facebook',
        maxLength: 255,
        name: 'library.any.facebook',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'instagram',
        label: 'instagram',
        maxLength: 255,
        name: 'library.any.instagram',
        padding: true,
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'suitableForChildren',
        label: 'suitableForChildren',
        name: 'library.any.suitableForChildren',
        options: ['yes', 'no'],
        required: false,
        type: 'radio'
    }
]

const shoppingFields = [
    {
        component: 'input',
        id: 'city',
        label: 'city',
        maxLength: 120,
        name: 'library.city',
        required: true,
        type: 'city',
        value: 'object'
    },
    {
        component: 'input',
        id: 'name',
        label: 'name',
        maxLength: 120,
        name: 'library.name',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'describe',
        label: 'describe',
        maxLength: 255,
        name: 'library.describe',
        padding: true,
        required: true,
        type: 'textarea'
    },
    {
        component: 'input',
        id: 'hourStart',
        label: 'hourStart',
        name: 'library.any.hourStart',
        required: true,
        type: 'time'
    },
    {
        component: 'input',
        id: 'hourEnd',
        label: 'hourEnd',
        name: 'library.any.hourEnd',
        required: true,
        type: 'time'
    },
    {
        component: 'input',
        id: 'workDays',
        label: 'workDays',
        name: 'library.any.workDays',
        padding: true,
        required: true,
        type: 'operationDays'
    },
    {
        component: 'input',
        id: 'address',
        label: 'address',
        maxLength: 120,
        name: 'library.address',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'phone',
        label: 'phone',
        maxLength: 30,
        name: 'library.any.phone',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'site',
        label: 'site',
        maxLength: 255,
        name: 'library.any.site',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'facebook',
        label: 'facebook',
        maxLength: 255,
        name: 'library.any.facebook',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'instagram',
        label: 'instagram',
        maxLength: 255,
        name: 'library.any.instagram',
        padding: true,
        required: false,
        type: 'text'
    }
]

const gastronomyFields = [
    {
        component: 'input',
        id: 'city',
        label: 'city',
        maxLength: 120,
        name: 'library.city',
        required: true,
        type: 'city',
        value: 'object'
    },
    {
        component: 'input',
        id: 'name',
        label: 'name',
        maxLength: 120,
        name: 'library.name',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'describe',
        label: 'describe',
        maxLength: 255,
        name: 'library.describe',
        padding: true,
        required: true,
        type: 'textarea'
    },
    {
        component: 'input',
        id: 'hourStart',
        label: 'hourStart',
        name: 'library.any.hourStart',
        required: true,
        type: 'time'
    },
    {
        component: 'input',
        id: 'hourEnd',
        label: 'hourEnd',
        name: 'library.any.hourEnd',
        required: true,
        type: 'time'
    },
    {
        component: 'input',
        id: 'workDays',
        label: 'workDays',
        name: 'library.any.workDays',
        padding: true,
        required: true,
        type: 'operationDays'
    },
    {
        component: 'input',
        id: 'address',
        label: 'address',
        maxLength: 120,
        name: 'library.address',
        required: true,
        type: 'text'
    },
    {
        component: 'input',
        id: 'phone',
        label: 'phone',
        maxLength: 30,
        name: 'library.any.phone',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'site',
        label: 'site',
        maxLength: 255,
        name: 'library.any.site',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'facebook',
        label: 'facebook',
        maxLength: 255,
        name: 'library.any.facebook',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'instagram',
        label: 'instagram',
        maxLength: 255,
        name: 'library.any.instagram',
        padding: true,
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'michelinStars',
        label: 'michelinStars',
        name: 'library.any.michelinStars',
        rateType: 'michelin',
        required: false,
        type: 'rating'
    },
    {
        component: 'input',
        id: 'prizes',
        label: 'prizes',
        maxLength: 255,
        name: 'library.any.prizes',
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'dressCode',
        label: 'dressCode',
        maxLength: 30,
        name: 'library.any.dressCode',
        padding: true,
        required: false,
        type: 'text'
    },
    {
        component: 'input',
        id: 'acceptsReservation',
        label: 'acceptsReservation',
        name: 'library.any.acceptsReservation',
        options: ['yes', 'no'],
        required: false,
        type: 'radio'
    },
    {
        component: 'input',
        id: 'requiredReservation',
        label: 'requiredReservation',
        name: 'library.any.requiredReservation',
        options: ['yes', 'no'],
        required: false,
        type: 'radio'
    },
    {
        component: 'input',
        id: 'suitableForChildren',
        label: 'suitableForChildren',
        name: 'library.any.suitableForChildren',
        options: ['yes', 'no'],
        required: false,
        type: 'radio'
    }
]

export { cuisineTypes, eventsFields, gastronomyFields, nightlifeFields, shoppingFields, tourFields }
