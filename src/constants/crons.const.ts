enum crons {
    ALWAYS = '* * * * * *',
    EVERY_FIVE_MINUTE = '*/5 * * * *',
    EVERY_HOUR = '0 * * * *',
    EVERY_MINUTE = '*/1 * * * *',
    EVERY_THEN_MINUTE = '*/10 * * * *'
}

export { crons }
