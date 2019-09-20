import { config } from '@config/config'
import { dateFormats } from '@/constants/dateFormats.const'
import { times } from '@/constants/times.const'

import * as fetch from 'node-fetch'
import * as moment from 'moment'
import * as momentTimezone from 'moment-timezone'

import { range } from 'ramda'

import { i18n } from '@i18n'

import TravelScript from '@features/travelScript/travelScript.schema'

const calculatePushDate = (date: moment.Moment, timezone: string, dstOffset: number, delayMinutes: number) =>
    momentTimezone(date)
        .tz(timezone)
        .subtract(delayMinutes, 'minutes')
        .subtract(dstOffset, 'seconds')
        .format()

const checkIntervalDay = (start: string, end: string): boolean => {
    const initialDate = moment(start)
    const finalDate = moment(end)
    return finalDate.isSameOrAfter(initialDate, 'day')
}

const checkIntervalMinute = (start: string, end: string): boolean => {
    const initialDate = moment(start)
    const finalDate = moment(end)
    return finalDate.isSameOrAfter(initialDate, 'minute')
}

const checkIsBefore = (date: number) => moment().isBefore(moment(date))

const format = (date: string, pattern: string) => moment(date).format(pattern)

const getIntervalDates = (start: string, end: string): any[] => {
    if (checkIntervalDay(start, end)) {
        const initialDate = moment(start).startOf('day')
        const finalDate = moment(end).startOf('day')
        const travelDays = finalDate.diff(initialDate, 'd')
        return range(0, travelDays + 1).map(() => {
            const dateScript = {
                date: initialDate.format(dateFormats.AMERICAN)
            }
            initialDate.add(1, 'd')
            return dateScript
        })
    }
    throw new Error(i18n.t('validations.finalDate'))
}

const isEquals = (date1, date2) => date1.format(dateFormats.AMERICAN_FULLEST) === date2.format(dateFormats.AMERICAN_FULLEST)

const joinHour = (date: string, hour: string): moment.Moment => {
    const dateMoment = moment(date).utc(false)
    const hourMoment = moment(hour).utc(false)
    return dateMoment
        .hour(hourMoment.hour())
        .minute(hourMoment.minute())
        .second(hourMoment.second())
}

const max = () => moment(new Date(times.MAX))

const createPushDate = async function(
    scriptId: any,
    scriptDate: any,
    dateToCalculate: string,
    hourToCalculate: string,
    delayMinutes: number
) {
    const script = await TravelScript.findOne({ _id: scriptId }).lean()
    const date = script.dates.find(d => d.date.toISOString() === scriptDate.toISOString())
    if (date && date.city && date.city.timezone) {
        const options = {
            headers: {
                Authorization: config.places.token
            }
        }
        const res = await fetch(`${config.places.url}/${date.city.id}`, options)
        const data = await res.json()
        if (data) {
            return calculatePushDate(joinHour(dateToCalculate, hourToCalculate), date.city.timezone, data.dstOffset, delayMinutes)
        }
    }
    return null
}

const toDate = momentDate => {
    const date = new Date(momentDate.format())
    const offset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset)
}

export {
    calculatePushDate,
    checkIntervalDay,
    checkIntervalMinute,
    checkIsBefore,
    createPushDate,
    format,
    getIntervalDates,
    isEquals,
    joinHour,
    max,
    toDate
}
