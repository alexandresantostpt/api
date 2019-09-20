import { crons } from '@constants/crons.const'
import { notificationStatus } from './constants'

import * as moment from 'moment'
import * as mongoose from 'mongoose'
import * as schedule from 'node-schedule'

import { not } from '@utils/functions.utils'
import { sendNotification } from '@utils/firebase.utils'
import { toDate } from '@utils/date.utils'

import Notification from './notification.schema'
import TravelScript from '../travelScript/travelScript.schema'

const checkNearsServices = () => {
    schedule.scheduleJob(crons.EVERY_MINUTE, async () => {
        const checkInitialDate = toDate(
            moment()
                .seconds(0)
                .milliseconds(0)
        )
        const checkEndDate = toDate(
            moment()
                .seconds(59)
                .milliseconds(999)
        )
        const notifications: any = await Notification.find({
            date: { $gte: checkInitialDate, $lte: checkEndDate },
            status: notificationStatus.PENDING
        })
        if (notifications.length) {
            Promise.all(
                notifications.map(async notification => {
                    const script = await TravelScript.findOne({ _id: mongoose.Types.ObjectId(notification.data.script) })
                        .populate('travel')
                        .lean()
                    if (not(script.deleted) && not(script.travel.archived) && not(script.travel.deleted) && script.travel.closed) {
                        const { _id, body, title, topic, data } = notification
                        const dataPush = {
                            pushId: _id.toString(),
                            scriptId: script._id.toString(),
                            serviceId: data._id.toString(),
                            travelId: script.travel._id.toString()
                        }
                        sendNotification(body, title, topic, dataPush)
                        notification.status = notificationStatus.SENT
                        notification.save()
                    }
                })
            )
        }
    })
}

export { checkNearsServices }
