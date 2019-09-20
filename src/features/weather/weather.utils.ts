import { dateFormats } from '@constants/dateFormats.const'

import * as moment from 'moment'

const parseDTO = (weatherResponse: any): any => {
    const { city, list } = weatherResponse
    const { id: cityId, name: cityName, country: cityCountry } = city
    const dto = {
        city: {
            country: cityCountry,
            id: cityId,
            name: cityName
        },
        dates: [...list].map(item => {
            const {
                clouds: cloudiness,
                deg: windDirection,
                dt,
                humidity,
                pressure,
                rain: precipitation,
                snow: snowVolume,
                speed: windSpeed,
                temp: { day, eve, max, min, morn, night },
                weather: [{ description: weatherDescription, icon: weatherIcon, main: weatherType }]
            } = item
            return {
                cloudiness,
                day: moment.unix(dt).format(dateFormats.AMERICAN),
                humidity,
                precipitation,
                sea_level: pressure,
                snowVolume,
                temp_day: day,
                temp_eve: eve,
                temp_max: max,
                temp_min: min,
                temp_morn: morn,
                temp_night: night,
                weather: {
                    description: weatherDescription,
                    icon: weatherIcon,
                    type: weatherType
                },
                windDirection,
                windSpeed
            }
        }),
        requestAt: moment().valueOf()
    }
    return dto
}

export { parseDTO }
