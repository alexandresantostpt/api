enum travelStatus {
    ARCHIVED = 'ARCHIVED',
    BOARDING_NEAR = 'BOARDING_NEAR',
    CONCLUDED = 'CONCLUDED',
    PENDING = 'PENDING',
    SENT = 'SENT',
    TRAVELING = 'TRAVELING'
}

const TRAVEL_STATUS = [
    travelStatus.ARCHIVED,
    travelStatus.BOARDING_NEAR,
    travelStatus.CONCLUDED,
    travelStatus.PENDING,
    travelStatus.SENT,
    travelStatus.TRAVELING
]

export { TRAVEL_STATUS, travelStatus }
