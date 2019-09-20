import { codes } from '@/constants/http.const'

import { Request, Response, Next } from 'restify'

import * as errors from 'restify-errors'
import * as fetch from 'node-fetch'

import { config } from '@config/config'

import { i18n } from '@i18n'

import { handleError } from '@/utils/api.utils'
import { parseDTO } from './weather.utils'
import { toInt } from '@utils/numbers.utils'

const getFiveDaysInfo = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            query: { city }
        } = req
        fetch(
            `${config.services.weather.url}/forecast/daily?appid=${
                config.services.weather.appKey
            }&q=${city}&units=metric&lang=pt&cnt=16`
        )
            .then(resp => {
                if (resp.status === codes.UNAUTHORIZED) {
                    handleError(req, res, new Error(i18n.t('messages.services.weather.unauthorized')), errors.BadRequestError)
                    return
                }
                return resp.json()
            })
            .then(json => {
                const { cod, message } = json
                if (cod && message) {
                    if (toInt(cod) === codes.NOT_FOUND) {
                        handleError(req, res, new Error(i18n.t(message)), errors.NotFoundError)
                    } else {
                        res.send(parseDTO(json))
                    }
                }
            })
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { getFiveDaysInfo }
