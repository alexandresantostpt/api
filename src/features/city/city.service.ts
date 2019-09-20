import { codes } from '@/constants/http.const'

import * as errors from 'restify-errors'
import * as fetch from 'node-fetch'

import { Request, Response, Next } from 'restify'

import { config } from '@config/config'

import { i18n } from '@i18n'

import { handleError } from '@/utils/api.utils'

const save = async (req: Request, res: Response, next: Next) => {
    try {
        const { body } = req
        const options = {
            body: JSON.stringify(body),
            headers: {
                Authorization: config.places.token
            },
            method: 'POST'
        }
        fetch(`${config.places.url}/google`, options)
            .then(resp => {
                if (resp.status === codes.UNAUTHORIZED) {
                    handleError(req, res, new Error(i18n.t('messages.places.unauthorized')), errors.BadRequestError)
                }
                return resp.json()
            })
            .then(json => {
                res.send(json)
                next()
            })
            .catch(error => {
                res.send(new errors.BadRequestError(error))
                next()
            })
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const search = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            query: { page = 0, pageCount = 10, q }
        } = req
        const options = {
            headers: {
                Authorization: config.places.token
            }
        }
        fetch(`${config.places.url}/search?q=${q}&page=${page}&pageCount=${pageCount}`, options)
            .then(resp => {
                if (resp.status === codes.UNAUTHORIZED) {
                    handleError(req, res, new Error(i18n.t('messages.places.unauthorized')), errors.BadRequestError)
                }
                return resp.json()
            })
            .then(json => {
                res.send(json)
                next()
            })
            .catch(error => {
                res.send(new errors.BadRequestError(error))
                next()
            })
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const searchGoogle = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            query: { q }
        } = req
        const options = {
            headers: {
                Authorization: config.places.token
            }
        }
        fetch(`${config.places.url}/google/search?q=${q}`, options)
            .then(resp => {
                if (resp.status === codes.UNAUTHORIZED) {
                    handleError(req, res, new Error(i18n.t('messages.places.unauthorized')), errors.BadRequestError)
                }
                return resp.json()
            })
            .then(json => {
                res.send(json)
                next()
            })
            .catch(error => {
                res.send(new errors.BadRequestError(error))
                next()
            })
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { save, search, searchGoogle }
