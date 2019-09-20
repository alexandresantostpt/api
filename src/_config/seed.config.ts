import { cuisineTypes, eventsFields, gastronomyFields, nightlifeFields, shoppingFields, tourFields } from '@constants/seed.const'
import { mocks } from '@/constants/mocks.const'

import * as moment from 'moment'
import * as mongoose from 'mongoose'
import * as seeder from 'mongoose-seed'

import { config } from './config'

import { not } from '@/utils/functions.utils'

import Agency from '@features/agency/agency.schema'

const PATH_FEATURES_BUILD = 'dist/src/features/'

const getSchema = (name: string) => `${PATH_FEATURES_BUILD}/${name}`

const seed = async () => {
    const dextraName = mocks.DEXTRA_AGENCY_NAME
    const dextraAgency = await Agency.findOne({ socialName: dextraName })
    if (not(dextraAgency)) {
        const { db } = config
        const { host, name, password, port, user } = db
        const agencyId = mongoose.Types.ObjectId()
        const data = [
            {
                documents: [
                    {
                        _by: 'SED',
                        _id: agencyId,
                        cnpj: '00.000.000/0000-00',
                        deleted: false,
                        socialName: dextraName
                    }
                ],
                model: 'Agency'
            },
            {
                documents: [
                    {
                        _by: 'SED',
                        active: true,
                        agency: agencyId,
                        blocked: false,
                        cellPhone: '(00)00000-0000',
                        cpf: '000.000.000-00',
                        deleted: false,
                        email: 'dextra@admin.com',
                        lastAccess: moment(),
                        name: mocks.DEXTRA_USER_NAME,
                        role: 'MASTER'
                    }
                ],
                model: 'User'
            },
            {
                documents: [
                    {
                        _by: 'SED',
                        code: 'events',
                        deleted: false,
                        describe: 'Eventos',
                        subCategories: [
                            {
                                code: 'fashion',
                                deleted: false,
                                describe: 'Moda',
                                fields: eventsFields
                            },
                            {
                                code: 'gastronomy',
                                deleted: false,
                                describe: 'Gastronomia',
                                fields: eventsFields
                            },
                            {
                                code: 'shows',
                                deleted: false,
                                describe: 'Espetáculos',
                                fields: eventsFields
                            },
                            {
                                code: 'music',
                                deleted: false,
                                describe: 'Música',
                                fields: eventsFields
                            },
                            {
                                code: 'art',
                                deleted: false,
                                describe: 'Arte',
                                fields: eventsFields
                            },
                            {
                                code: 'sports',
                                deleted: false,
                                describe: 'Esportes',
                                fields: eventsFields
                            },
                            {
                                code: 'local',
                                deleted: false,
                                describe: 'Local',
                                fields: eventsFields
                            }
                        ]
                    },
                    {
                        _by: 'SED',
                        code: 'nightlife',
                        deleted: false,
                        describe: 'Vida Noturna',
                        subCategories: [
                            {
                                code: 'nightClubs',
                                deleted: false,
                                describe: 'Night Clubs',
                                fields: nightlifeFields
                            },
                            {
                                code: 'bars',
                                deleted: false,
                                describe: 'Bares',
                                fields: nightlifeFields
                            }
                        ]
                    },
                    {
                        _by: 'SED',
                        code: 'tour',
                        deleted: false,
                        describe: 'Passeio',
                        legend: 'Ao ar livre',
                        legendCode: 'freedomAir',
                        subCategories: [
                            {
                                code: 'monuments',
                                deleted: false,
                                describe: 'Monumentos',
                                fields: tourFields
                            },
                            {
                                code: 'gardens',
                                deleted: false,
                                describe: 'Jardins',
                                fields: tourFields
                            },
                            {
                                code: 'streetAreaDistrict',
                                deleted: false,
                                describe: 'Ruas, áreas e distritos',
                                fields: tourFields
                            },
                            {
                                code: 'wineries',
                                deleted: false,
                                describe: 'Vinículas',
                                fields: tourFields
                            },
                            {
                                code: 'squares',
                                deleted: false,
                                describe: 'Praças',
                                fields: tourFields
                            },
                            {
                                code: 'parks',
                                deleted: false,
                                describe: 'Parques',
                                fields: tourFields
                            },
                            {
                                code: 'beaches',
                                deleted: false,
                                describe: 'Praias',
                                fields: tourFields
                            }
                        ]
                    },
                    {
                        _by: 'SED',
                        code: 'tour',
                        deleted: false,
                        describe: 'Passeio',
                        legend: 'Artes e cultura',
                        legendCode: 'artsCulture',
                        subCategories: [
                            {
                                code: 'movieTheater',
                                deleted: false,
                                describe: 'Cinema',
                                fields: tourFields
                            },
                            {
                                code: 'theater',
                                deleted: false,
                                describe: 'Teatro',
                                fields: tourFields
                            },
                            {
                                code: 'library',
                                deleted: false,
                                describe: 'Biblioteca',
                                fields: tourFields
                            },
                            {
                                code: 'museumsGalleries',
                                deleted: false,
                                describe: 'Museus e galerias',
                                fields: tourFields
                            },
                            {
                                code: 'aquarium',
                                deleted: false,
                                describe: 'Aquário',
                                fields: tourFields
                            },
                            {
                                code: 'churchTemples',
                                deleted: false,
                                describe: 'Igrejas/Templos',
                                fields: tourFields
                            }
                        ]
                    },
                    {
                        _by: 'SED',
                        code: 'shopping',
                        deleted: false,
                        describe: 'Compras',
                        subCategories: [
                            {
                                code: 'libraries',
                                deleted: false,
                                describe: 'Livrarias',
                                fields: shoppingFields
                            },
                            {
                                code: 'articlesSports',
                                deleted: false,
                                describe: 'Artigos esportivos',
                                fields: shoppingFields
                            },
                            {
                                code: 'home',
                                deleted: false,
                                describe: 'Casa',
                                fields: shoppingFields
                            },
                            {
                                code: 'clothes',
                                deleted: false,
                                describe: 'Roupas',
                                fields: shoppingFields
                            },
                            {
                                code: 'acessories',
                                deleted: false,
                                describe: 'Acessórios',
                                fields: shoppingFields
                            },
                            {
                                code: 'department',
                                deleted: false,
                                describe: 'Departamento',
                                fields: shoppingFields
                            },
                            {
                                code: 'cosmetics',
                                deleted: false,
                                describe: 'Cosméticos',
                                fields: shoppingFields
                            },
                            {
                                code: 'childlike',
                                deleted: false,
                                describe: 'Infantil',
                                fields: shoppingFields
                            },
                            {
                                code: 'eletronics',
                                deleted: false,
                                describe: 'Eletrônicos',
                                fields: shoppingFields
                            },
                            {
                                code: 'art',
                                deleted: false,
                                describe: 'Arte',
                                fields: shoppingFields
                            },
                            {
                                code: 'clothing',
                                deleted: false,
                                describe: 'Vestuário',
                                fields: shoppingFields
                            }
                        ]
                    },
                    {
                        _by: 'SED',
                        code: 'gastronomy',
                        deleted: false,
                        describe: 'Gastronomia',
                        subCategories: [
                            {
                                code: 'streetFood',
                                deleted: false,
                                describe: 'Street Food',
                                fields: gastronomyFields
                            },
                            {
                                code: 'restaurant',
                                deleted: false,
                                describe: 'Restaurante',
                                fields: [
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
                                        id: 'cuisine',
                                        label: 'cuisine',
                                        name: 'library.any.cuisine',
                                        options: cuisineTypes,
                                        padding: true,
                                        required: true,
                                        type: 'select'
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
                            },
                            {
                                code: 'gifts',
                                deleted: false,
                                describe: 'Docerias',
                                fields: gastronomyFields
                            },
                            {
                                code: 'bakeries',
                                deleted: false,
                                describe: 'Padarias',
                                fields: gastronomyFields
                            },
                            {
                                code: 'coffes',
                                deleted: false,
                                describe: 'Cafés',
                                fields: gastronomyFields
                            },
                            {
                                code: 'iceCreamShop',
                                deleted: false,
                                describe: 'Sorveterias',
                                fields: gastronomyFields
                            },
                            {
                                code: 'teaHouses',
                                deleted: false,
                                describe: 'Casas de chá',
                                fields: gastronomyFields
                            }
                        ]
                    }
                ],
                model: 'Category'
            }
        ]

        seeder.connect(`mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`, () => {
            console.log('[Seed] => Connected with success')
            seeder.loadModels([
                getSchema('agency/agency.schema.js'),
                getSchema('category/category.schema.js'),
                getSchema('user/user.schema.js')
            ])
            seeder.populateModels(data, () => console.log('[Seed] => Seeders runned with success'))
        })
    }
}

export { seed }
