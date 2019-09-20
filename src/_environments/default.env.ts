import { environments } from '@/constants/environments.const'

import { load } from '@config/env.config'

import { toInt } from '@utils/numbers.utils'

import EnvType from '@/types/env.type'

const config = (): EnvType =>
    load(
        (): EnvType => ({
            api: {
                environment: environments.development,
                host: '0.0.0.0',
                name: 'tpt-api',
                port: 8080,
                portSSL: 443,
                prefix: '/v1/api',
                secret: process.env.TPT_API_SECRET,
                version: '1.0.0'
            },
            app: {
                url: 'http://tpt-dev.dextra.tech'
            },
            db: {
                host: process.env.TPT_API_DB_HOST,
                name: process.env.TPT_API_DB_NAME,
                password: process.env.TPT_API_DB_PASSWORD,
                port: toInt(process.env.TPT_API_DB_PORT),
                user: process.env.TPT_API_DB_USER
            },
            firebase: {
                clientEmail: process.env.TPT_API_FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.TPT_API_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                projectId: process.env.TPT_API_FIREBASE_PROJECT_ID
            },
            mail: {
                auth: {
                    pass: process.env.TPT_API_MAIL_PASS,
                    user: process.env.TPT_API_MAIL_USER
                },
                host: process.env.TPT_API_MAIL_HOST,
                port: toInt(process.env.TPT_API_MAIL_PORT),
                secure: Boolean(process.env.TPT_API_MAIL_SECURE)
            },
            places: {
                token: process.env.TPT_API_PLACES_TOKEN,
                url: process.env.TPT_API_PLACES_URL
            },
            services: {
                aerial: {
                    appId: process.env.TPT_API_SERVICE_AERIAL_APP_ID,
                    appKey: process.env.TPT_API_SERVICE_AERIAL_APP_KEY,
                    url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/json'
                },
                weather: {
                    appId: null,
                    appKey: process.env.TPT_API_SERVICE_WEATHER_APP_KEY,
                    url: 'http://api.openweathermap.org/data/2.5'
                }
            }
        })
    )

export { config }
