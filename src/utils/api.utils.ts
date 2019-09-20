import { config } from '@config/config'

import { Response, Request } from 'restify'

const createUrlContext = (context: string): string => `${config.api.prefix}/${context}`

const handleError = (req: Request, res: Response, error: Error, errorType: any) => {
    const { message } = error
    req.log.error(error)
    res.send(new errorType(message))
}

const updatedWithSuccess = (message: string, rowsUpdated: number) => ({ message, rowsUpdated })

export { createUrlContext, handleError, updatedWithSuccess }
