import { mocks } from '@/constants/mocks.const'
import { roles } from '../user/constants'

import * as errors from 'restify-errors'

import { Request, Response, Next } from 'restify'

import { getToken } from '@/utils/auth.utils'
import { handleError } from '@utils/api.utils'

import Agency from '@features/agency/agency.schema'
import User from '@features/user/user.schema'
import { toInt } from '@/utils/numbers.utils'

const create = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body: { agency, user }
        } = req
        const token = getToken(req)
        const newAgency = await Agency.create({ ...agency, _by: token })
        const newUser = await User.create({
            ...user,
            _by: token,
            agency: newAgency._id
        })
        res.send({
            agency: newAgency,
            user: newUser
        })
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const del = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body: { agency, user }
        } = req
        const oldAgency = await Agency.findOneAndUpdate({ _id: agency }, { $set: { deleted: true } }, { new: true })
        const oldUser = await User.findOneAndUpdate({ _id: user }, { $set: { deleted: true } }, { new: true })
        res.send({
            agency: oldAgency,
            user: oldUser
        })
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const edit = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { agencyId, userId }
        } = req
        const agency = await Agency.findOne({ _id: agencyId })
        const user = await User.findOne({ _id: userId })
        if (agency && user) {
            res.send({
                agency,
                user
            })
        } else {
            res.send(new errors.NotFoundError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const getAll = async (req: Request, res: Response, next: Next) => {
    try {
        const users = await User.find({ deleted: false, name: { $ne: mocks.DEXTRA_USER_NAME }, role: roles.ADMIN }).populate('agency')
        res.send(users)
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const update = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body: { agency, user }
        } = req
        const token = getToken(req)
        const newAgency = await Agency.findOneAndUpdate(
            { _id: agency._id },
            { ...agency, __v: toInt(agency.__v) + 1, _by: token },
            { context: 'query', new: true }
        ).lean()
        const newUser = await User.findOneAndUpdate(
            { _id: user._id },
            { ...user, __v: toInt(user.__v) + 1, _by: token },
            { context: 'query', new: true }
        ).lean()
        if (newAgency && newUser) {
            if (newUser.blocked) {
                await User.updateMany({ agency }, { $set: { blocked: true } })
            }
            res.send({
                agency: newAgency,
                user: newUser
            })
        } else {
            res.send(new errors.NotFoundError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { create, del, edit, getAll, update }
