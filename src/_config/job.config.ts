import { checkAerialStatus } from '@features/aerial/aerial.jobs'
import { checkNearsServices } from '@features/notification/notification.jobs'
import { checkTravelStatus } from '@features/travel/travel.jobs'

const start = () => {
    checkAerialStatus()
    checkNearsServices()
    checkTravelStatus()
}

export { start }
