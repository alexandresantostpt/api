import { serviceSchemas } from '@/constants/serviceSchemas.const'
import { travelStatus } from './constants'

import * as mongoose from 'mongoose'
import * as errors from 'restify-errors'

import { Request, Response, Next } from 'restify'

import { i18n } from '@i18n'

import { crud } from '@/utils/database.utils'
import { getRole, getToken, getAgencyId } from '@/utils/auth.utils'
import { getIntervalDates } from '@/utils/date.utils'
import { getGroupServices, getWhere, createNotification, processNotification } from './travel.utils'
import { handleError } from '@utils/api.utils'
import { not } from '@utils/functions.utils'
import { sendNotification } from '@/utils/firebase.utils'
import { toInt } from '@utils/numbers.utils'

import { creatingClients } from '@features/client/client.service'
import { populateTravelScriptDates } from '@features/travelScript/travelScript.service'

import _TravelScript from '@features/travelScript/_travelScript.schema'
import Notification from '@features/notification/notification.schema'
import Service from '@features/service/service.schema'
import Travel from './travel.schema'
import TravelScript from '@features/travelScript/travelScript.schema'
import User from '@features/user/user.schema'

const { download, getFields, upload } = crud(Travel)

const checkServicesClients = async (serviceDates: string[], newClients: string[]) => {
    const oldServices: any = await Service.find({ scriptDate: { $in: serviceDates } })
    oldServices.forEach(async oldService => {
        const schema = serviceSchemas[oldService.type]
        const service = await schema.findOne({ _id: oldService._id })
        if (service.checkClients) {
            service.checkClients(newClients)
        }
        service.save()
    })
}

const checkServicesDates = async (removedDates: string[], scriptId: any) => {
    removedDates.forEach(async removedDate => {
        await Service.deleteMany({ script: scriptId, scriptDate: removedDate })
        await Notification.deleteMany({ 'data.script': mongoose.Types.ObjectId(scriptId), 'data.scriptDate': new Date(removedDate) })
    })
}

const createPayload = (startDate: string, endDate: string) => ({
    dates: getIntervalDates(startDate, endDate).map(({ date }) => ({
        city: null,
        date,
        services: []
    }))
})

const updateCities = async (city: string, scriptId: any) => {
    const travelScript: any = await TravelScript.findOne({ _id: scriptId })
    travelScript && travelScript.dates.forEach(async date => (date.city = city))
    await travelScript.save()
}

const archive = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { id }
        } = req
        const token = getToken(req)
        res.send(
            await Travel.findOneAndUpdate(
                { _id: id, status: travelStatus.CONCLUDED },
                { $set: { _by: token, archived: true, status: travelStatus.ARCHIVED } },
                { context: 'query', new: true }
            ).populate('clients')
        )
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const create = async (req: Request, res: Response, next: Next) => {
    try {
        const { body } = req
        const { citiesDestiny, clients, travelEndDate, travelStartDate } = body
        const token = getToken(req)

        Promise.all(creatingClients(clients, token))
            .then(async newClients => {
                const newTravel = await Travel.create({
                    ...body,
                    _by: token,
                    clients: newClients
                })
                const payload = createPayload(travelStartDate, travelEndDate)

                const travelScript = await TravelScript.create({
                    ...payload,
                    _by: token,
                    travel: newTravel
                })

                if (citiesDestiny.length === 1) {
                    await updateCities(citiesDestiny[0], travelScript._id)
                }

                res.send(await Travel.findOne(newTravel).populate('clients'))
                next()
            })
            .catch(error => handleError(req, res, error, errors.BadRequestError))
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const close = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { id }
        } = req
        const token = getToken(req)
        const role = getRole(token)
        const where = {
            ...getWhere(role, token),
            _id: id
        }
        const travel = await Travel.findOne(where)
            .populate('clients')
            .lean()

        if (travel) {
            const travelScript: any = await TravelScript.findOne({ deleted: false, travel: travel._id }).lean()
            if (travelScript) {
                let _travelScript: any = await _TravelScript.findOne({ travel: travel._id })
                if (not(_travelScript)) {
                    travelScript.dates = await populateTravelScriptDates(travelScript)

                    _travelScript = await _TravelScript.create({
                        __v: travelScript.__v,
                        _by: token,
                        _id: travelScript._id,
                        dates: travelScript.dates,
                        deleted: travelScript.deleted,
                        travel: travelScript.travel
                    })

                    if (_travelScript) {
                        await Travel.findOneAndUpdate(
                            { _id: id },
                            { $set: { _by: token, closed: true, status: travelStatus.SENT } },
                            { context: 'query', new: true }
                        )
                        const data = {
                            scriptId: travelScript._id.toString(),
                            travelId: travel._id.toString()
                        }
                        const title = i18n.t('titles.push.insert', { lng: 'pt' })
                        const message = i18n.t('messages.push.insert.travel', { title: travel.title, lng: 'pt' })
                        travel.clients.forEach(client => {
                            createNotification(client, data, title, message).then((notification: any) =>
                                sendNotification(notification.body, notification.title, notification.topic, notification.data)
                            )
                        })
                        res.send(await Travel.findOne({ _id: id }).populate('users'))
                    } else {
                        res.send(new errors.NotFoundError())
                    }
                } else {
                    res.send(new errors.NotFoundError())
                }
            } else {
                res.send(new errors.NotFoundError())
            }
        } else {
            res.send(new errors.NotFoundError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const del = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { id }
        } = req
        const token = getToken(req)
        const oldTravel = await Travel.findOneAndUpdate(
            { _id: id },
            { $set: { _by: token, deleted: true } },
            { context: 'query', new: true }
        )
        await TravelScript.findOneAndUpdate({ travel: id }, { $set: { _by: token, deleted: true } }, { context: 'query', new: true })
        res.send(oldTravel)
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const edit = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { id }
        } = req
        const travel = await Travel.findOne({ _id: id, deleted: false })
            .populate('clients')
            .lean()
        const { _id: idScript } = await TravelScript.findOne({ travel: id }).lean()
        const services = await getGroupServices(idScript)
        res.send({ ...travel, services })
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const getAll = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const role = getRole(token)
        res.send(await Travel.find(getWhere(role, token)).populate('clients'))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const getAllArchived = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const role = getRole(token)
        const where = {
            ...getWhere(role, token),
            archived: true
        }
        res.send(await Travel.find(where).populate('clients'))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const share = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body,
            params: { id }
        } = req
        const { email } = body
        const token = getToken(req)
        const travel = await Travel.findById(id).lean()
        const user = await User.findOne({ agency: getAgencyId(token), email }).lean()
        if (user) {
            const userIncluded = await Travel.findOne({ _id: travel._id, users: { $in: [user._id] } })
            if (userIncluded) {
                res.send(new errors.BadRequestError(i18n.t('messages.userRepeated')))
            } else {
                await Travel.findOneAndUpdate(
                    { _id: id },
                    { ...travel, _by: token, users: [...travel.users, user._id] },
                    { context: 'query', new: true }
                )
                res.send(await Travel.findOne({ _id: id }).populate('users'))
            }
        } else {
            res.send(new errors.NotFoundError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const unarchive = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { id }
        } = req
        const token = getToken(req)
        res.send(
            await Travel.findOneAndUpdate(
                { _id: id, status: travelStatus.ARCHIVED },
                { $set: { _by: token, archived: false, status: travelStatus.CONCLUDED } },
                { context: 'query', new: true }
            ).populate('clients')
        )
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const unshare = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            body,
            params: { id }
        } = req
        const { userId } = body
        const token = getToken(req)
        const travel = await Travel.findById(id).lean()
        if (travel) {
            await Travel.findOneAndUpdate(
                { _id: id },
                { ...travel, _by: token, users: travel.users.filter(user => user.toString() !== userId.toString()) },
                { context: 'query', new: true }
            )
            res.send(await Travel.findOne({ _id: id }).populate('users'))
        } else {
            res.send(new errors.NotFoundError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const update = async (req: Request, res: Response, next: Next) => {
    try {
        const { body } = req
        const { citiesDestiny, clients, _id: id, travelEndDate, travelStartDate, __v } = body
        const filterClients = clients.map(({ _id }) => _id)
        const payload = createPayload(travelStartDate, travelEndDate)
        const token = getToken(req)

        const oldTravelScript: any = await TravelScript.findOne({ travel: id })
        const newDates = payload.dates.map(newDate => newDate.date)
        const oldDates = oldTravelScript.dates.map(oldDate => oldDate.date.toISOString())
        const removedDates = oldDates.filter(oldDate => not(newDates.some(newDate => oldDate.startsWith(newDate))))

        Promise.all(creatingClients(clients, token))
            .then(async newClients => {
                const newTravel = await Travel.findOneAndUpdate(
                    { _id: id },
                    {
                        ...body,
                        __v: toInt(__v) + 1,
                        _by: token,
                        clients: newClients
                    },
                    { context: 'query', new: true }
                ).lean()

                payload.dates = payload.dates.map(date => {
                    const existsDate = oldTravelScript.dates.find(({ date: oldDate }) => oldDate.toISOString().startsWith(date.date))
                    if (existsDate) {
                        return existsDate
                    }
                    return date
                })

                const newTravelScript = {
                    __v: 0,
                    _by: token,
                    _id: oldTravelScript._id,
                    createdAt: oldTravelScript.createdAt,
                    travel: oldTravelScript.travel,
                    updatedAt: oldTravelScript.updatedAt,
                    ...payload
                }
                await TravelScript.updateOne({ travel: newTravel._id }, newTravelScript)

                const datesServices = payload.dates.map(({ date }) => date)
                await checkServicesClients(datesServices, filterClients)
                await checkServicesDates(removedDates, oldTravelScript._id)

                if (citiesDestiny.length === 1) {
                    await updateCities(citiesDestiny[0], newTravelScript._id)
                }

                return Promise.resolve(newTravel)
            })
            .then(async newTravel => {
                res.send(await Travel.findOne({ _id: newTravel._id }).populate('clients'))
                next()
            })
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const updateMaterial = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { id }
        } = req

        const token = getToken(req)
        const role = getRole(token)
        const where = {
            ...getWhere(role, token),
            _id: id,
            closed: true
        }

        const travel = await Travel.findOne(where)
            .populate('clients')
            .lean()

        if (travel) {
            const travelScript: any = await TravelScript.findOne({ travel: travel._id }).lean()

            if (travelScript) {
                travelScript.dates = await populateTravelScriptDates(travelScript)
                const _travelScript: any = await _TravelScript.findOneAndUpdate(
                    { travel: travel._id },
                    {
                        $set: {
                            __v: travelScript.__v,
                            _by: token,
                            _id: travelScript._id,
                            dates: travelScript.dates,
                            deleted: travelScript.deleted,
                            travel: travelScript.travel
                        }
                    },
                    { context: 'query', new: true }
                )
                if (_travelScript) {
                    processNotification(travel.clients, _travelScript._id)
                    res.send(await Travel.findOne({ _id: id }).populate('users'))
                } else {
                    res.send(new errors.NotFoundError())
                }
            } else {
                res.send(new errors.NotFoundError())
            }
        } else {
            res.send(new errors.NotFoundError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export {
    archive,
    close,
    create,
    del,
    download,
    edit,
    getAll,
    getAllArchived,
    getFields,
    share,
    unarchive,
    unshare,
    update,
    updateMaterial,
    upload
}
