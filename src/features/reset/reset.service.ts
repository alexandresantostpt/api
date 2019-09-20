import { mocks } from '@/constants/mocks.const'

import * as errors from 'restify-errors'

import { Next, Request, Response } from 'restify'

import { handleError } from '@/utils/api.utils'

import Agency from '@features/agency/agency.schema'
import Client from '@features/client/client.schema'
import Service from '@/features/service/service.schema'
import Notification from '@features/notification/notification.schema'
import Travel from '@features/travel/travel.schema'
import TravelScript from '@features/travelScript/travelScript.schema'
import User from '@features/user/user.schema'
import Library from '@/features/library/library.schema'

const reset = async (req: Request, res: Response, next: Next) => {
    try {
        await Agency.remove({ socialName: { $ne: mocks.DEXTRA_AGENCY_NAME } })
        await Client.remove({})
        await Notification.remove({})
        await Service.remove({})
        await Travel.remove({})
        await TravelScript.remove({})
        await User.remove({ name: { $ne: mocks.DEXTRA_USER_NAME } })
        await Library.remove({})
        res.end()
        next()
    } catch (error) {
        handleError(req, res, error, errors.BadRequestError)
    }
}

export { reset }
