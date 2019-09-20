import { crons } from '@constants/crons.const'
import { travelStatus } from './constants'

import * as moment from 'moment'
import * as schedule from 'node-schedule'

import Travel from './travel.schema'

const checkTravelStatus = () => {
    schedule.scheduleJob(crons.EVERY_HOUR, async () => {
        const checkTravels = await Travel.find().and([
            { status: { $ne: travelStatus.PENDING } },
            { status: { $ne: travelStatus.CONCLUDED } }
        ])
        checkTravels.forEach((travel: any) => {
            const { status } = travel
            const now = moment()
            const startDate = moment(travel.travelStartDate.toISOString())
            const endDate = moment(travel.travelEndDate.toISOString())
            if (status === travelStatus.SENT) {
                const oneWeek = 7
                const remainingDays = startDate.diff(now, 'days')
                if (remainingDays <= oneWeek) {
                    travel.status = travelStatus.BOARDING_NEAR
                }
            }
            if (status === travelStatus.BOARDING_NEAR) {
                if (now.isAfter(startDate)) {
                    travel.status = travelStatus.TRAVELING
                }
            }
            if (status === travelStatus.TRAVELING) {
                if (now.isAfter(endDate)) {
                    travel.status = travelStatus.CONCLUDED
                }
            }
            travel.save()
        })
    })
}

export { checkTravelStatus }
