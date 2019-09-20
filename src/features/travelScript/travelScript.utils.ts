const checkDiffDates = (_dates: any[], date: any, dateIndex: number) => {
    delete date.city._id
    delete _dates[dateIndex].city._id
    return (
        JSON.stringify(date.city) !== JSON.stringify(_dates[dateIndex].city) ||
        date.date.toISOString() !== _dates[dateIndex].date.toISOString() ||
        date.services.length !== _dates[dateIndex].services.length ||
        date.services.some(
            (service, serviceIndex) =>
                JSON.stringify(service.service) !== JSON.stringify(_dates[dateIndex].services[serviceIndex].service)
        )
    )
}

const compareTravelScript = (travelScript: any, _travelScript: any): boolean => {
    const { dates } = travelScript
    const { dates: _dates } = _travelScript
    if (dates.length !== _dates.length) {
        return true
    }
    return dates.some((date, dateIndex) => checkDiffDates(_dates, date, dateIndex))
}

export { compareTravelScript }
