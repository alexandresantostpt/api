import { roles } from '@features/user/constants'

import * as crypto from 'crypto'
import * as errors from 'restify-errors'
import * as jwt from 'jsonwebtoken'

import { Request, Response, Next } from 'restify'

import { config } from '@config/config'

import { checkIsBefore } from './date.utils'
import { not } from './functions.utils'

const HASH_ALGORITHM = 'sha256'

const decodeJwt = (token: string): any => jwt.verify(token, config.api.secret)

const getToken = (req: Request) => req.header('Authorization')

const checkRole = (checkRoles: string[]) => (req: Request, res: Response, next: Next) => {
    const token = getToken(req)
    const decoded = decodeJwt(token)
    const userRole = decoded && decoded.user && decoded.user.role
    if (userRole && not(checkRoles.some(role => role === userRole))) {
        res.send(new errors.ForbiddenError())
        next(false)
    }
    next()
}

const checkToken = (token: string): boolean => {
    if (token) {
        try {
            const decoded = decodeJwt(token)
            return checkIsBefore(decoded.expires)
        } catch (error) {
            return false
        }
    }
    return false
}

const checkAuthorized = (req: Request, res: Response, next: Next): void => {
    const token = getToken(req)
    if (not(checkToken(token))) {
        res.send(new errors.UnauthorizedError())
        next(false)
    }
    next()
}

const createJwt = (user: any, expires: number): string => jwt.sign({ user, expires }, config.api.secret)

const crypt = (s: string): string =>
    crypto
        .createHash(HASH_ALGORITHM)
        .update(s)
        .digest('hex')

const cryptPassword = (password: string, salt: string): string => {
    const saltCypted = crypt(salt)
    return crypto
        .createHmac(HASH_ALGORITHM, saltCypted)
        .update(password)
        .digest('hex')
}

const getAgencyId = (token: string) => decodeJwt(token).user.agency

const getCpf = (token: string) => decodeJwt(token).user.cpf

const getRole = (token: string) => decodeJwt(token).user.role

const getUserId = (token: string) => decodeJwt(token).user._id

export { checkAuthorized, checkRole, createJwt, crypt, cryptPassword, decodeJwt, getAgencyId, getCpf, getRole, getToken, getUserId }
