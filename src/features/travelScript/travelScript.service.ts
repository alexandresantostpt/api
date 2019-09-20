import * as errors from 'restify-errors'

import { Request, Response, Next } from 'restify'

import { compareTravelScript } from '@features/travelScript/travelScript.utils'
import { crud } from '@utils/database.utils'
import { getRole, getToken, getAgencyId } from '@utils/auth.utils'
import { getWhere, populateTravelScriptDates, findOneAndPopulate } from '@features/travel/travel.utils'
import { handleError } from '@utils/api.utils'
import * as LibraryService from '@features/library/library.service'
import * as ServiceService from '@features/service/service.service'

import _TravelScript from '@features/travelScript/_travelScript.schema'
import { libraries as LibraryTypes } from '@/constants/libraries.const'
import { services as ServiceTypes } from '@/constants/services.const'
import Library from '../library/library.schema'
import TipService from '../tip/tipService.schema'
import Travel from '@features/travel/travel.schema'
import TravelScript from '@features/travelScript/travelScript.schema'

const { getFields } = crud(TravelScript)

const getScript = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { id: travelId }
        } = req

        const token = getToken(req)
        const role = getRole(token)

        const where = {
            ...getWhere(role, token),
            _id: travelId
        }

        let edited = false

        const travel: any = await Travel.findOne(where)

        if (travel) {
            const travelScript = await findOneAndPopulate(TravelScript, { travel: travelId }, true)
            const _travelScript = await findOneAndPopulate(_TravelScript, { travel: travelId }, false)

            if (travelScript && _travelScript) {
                edited = compareTravelScript(travelScript, _travelScript)
            }

            res.send({ ...travelScript, edited })
        } else {
            res.send(new errors.NotFoundError())
        }
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const getScriptToClients = async (req: Request, res: Response, next: Next) => {
    try {
        const {
            params: { id: travelId }
        } = req

        const token = getToken(req)
        const role = getRole(token)

        const where = {
            ...getWhere(role, token),
            _id: travelId,
            deleted: false
        }

        const travel: any = await Travel.findOne(where)

        if (travel) {
            const _travelScript = await findOneAndPopulate(_TravelScript, { travel: travelId }, false)
            if (_travelScript) {
                res.send(_travelScript)
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

/**
 * Removes any Library from the specified TipService
 * @param libraryId - ID from Library.
 * @param tipId - ID from TipService.
 */
const popLibraryFromTipService = async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const token = getToken(req)
        const { libraryId, tipId } = req.body

        const library = await Library.findOne({ _id: libraryId, deleted: false })
        const tip: any = await TipService.findOne({ _id: tipId, deleted: false }).populate('libraries')

        tip._by = token
        tip.libraries.pop(library)
        await tip.save()

        res.send(tip)
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

/**
 * Adds any Library to the specified TipService, if no `tipId` is provided and
 * the type of the provided `libraryId` is `libraries.TIP`, then the following occurs:
 * 1 - A new TipService is created and references the provided `libraryId` as its ownd Library.
 * 2 - The newly created TipService is added to TravelScrip specified Date.
 * @param scriptId - ID from TravelScript, in case of no `tipId` is provided.
 * @param dateId - ID from target date inside TravelScript to add the Tip, in case of no `tipId` is provided.
 * @param libraryId - ID from Library.
 * @param tipId - ID from TipService.
 */
const pushLibraryToTipService = async (req: Request, res: Response, next: Next): Promise<void> => {
    try {
        const token = getToken(req)
        const { scriptId, dateId, libraryId, tipId } = req.body

        const library = await Library.findOne({ _id: libraryId, deleted: false }).lean()

        if (tipId) {
            const tip: any = await TipService.findOne({ _id: tipId, deleted: false })

            tip._by = token
            tip.libraries.push(library)

            await tip.save()
        } else if (library.type === LibraryTypes.TIP) {
            const travelScript: any = await TravelScript.findOne({ _id: scriptId, deleted: false })
            const date = travelScript.dates.id(dateId)

            const service = await ServiceService.save(
                {
                    libraries: [library],
                    scriptDate: date.date
                },
                ServiceTypes.TIP,
                token,
                scriptId
            )

            date.services.push({ _id: service.id })

            travelScript._by = token
            await travelScript.save()
        }

        res.send(await findOneAndPopulate(TravelScript, { _id: scriptId }, true))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const putService = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const agency = getAgencyId(token)
        const { dateId, scriptId, service: data, type } = req.body
        const { library: libraryData, ...serviceData } = data

        const travelScript: any = await TravelScript.findOne({ _id: scriptId, deleted: false })
        const date = travelScript.dates.id(dateId)
        const { services } = date

        let library
        if (libraryData) {
            library = await LibraryService.save({ ...libraryData, agency }, type, token, date.city)
            serviceData.library = library
        }

        const service = await ServiceService.save(serviceData, type, token, scriptId)

        if (!services.id(service._id)) {
            services.push({ _id: service._id })
        }

        travelScript._by = token
        await travelScript.save(service)

        res.send(service)
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const removeService = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const { dateId, scriptId, serviceId } = req.body
        await ServiceService.remove(serviceId)

        const travelScript: any = await TravelScript.findOne({ _id: scriptId, deleted: false })
        const services = travelScript.dates.id(dateId).services

        if (services.id(serviceId)) {
            services.pull(serviceId)
        }

        travelScript._by = token
        await travelScript.save()

        res.send(travelScript)
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

const updateCity = async (req: Request, res: Response, next: Next) => {
    try {
        const token = getToken(req)
        const { scriptId } = req.params
        const { _id: dateId, city } = req.body

        const where = { _id: scriptId }
        const travelScript: any = await TravelScript.findOne(where)

        const travelScriptDate = travelScript.dates.find(date => date.id === dateId)

        if (travelScriptDate !== undefined) {
            travelScriptDate.city = city
        }

        travelScript._by = token
        await travelScript.save()

        res.send(await findOneAndPopulate(TravelScript, where, true))
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export {
    getFields,
    getScript,
    getScriptToClients,
    popLibraryFromTipService,
    pushLibraryToTipService,
    populateTravelScriptDates,
    putService,
    removeService,
    updateCity
}
