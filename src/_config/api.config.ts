import * as corsMiddleware from 'restify-cors-middleware'
import * as pino from 'restify-pino-logger'

import { plugins } from 'restify'

const setup = ({ server, serverHTTPS }) => {
    const cors = corsMiddleware({
        allowHeaders: ['Authorization'],
        exposeHeaders: ['Authorization'],
        origins: ['*']
    })

    server.pre(cors.preflight)
    serverHTTPS.pre(cors.preflight)
    server.pre(plugins.pre.context())
    serverHTTPS.pre(plugins.pre.context())
    server.pre(plugins.pre.dedupeSlashes())
    serverHTTPS.pre(plugins.pre.dedupeSlashes())
    server.pre(plugins.pre.userAgentConnection())
    serverHTTPS.pre(plugins.pre.userAgentConnection())
    server.pre(plugins.queryParser({ allowDots: true }))
    serverHTTPS.pre(plugins.queryParser({ allowDots: true }))
    server.pre(plugins.pre.sanitizePath())
    serverHTTPS.pre(plugins.pre.sanitizePath())

    server.use(cors.actual)
    serverHTTPS.use(cors.actual)
    server.use(
        plugins.bodyParser({
            mapFiles: true,
            maxFileSize: 2 * 1024 * 1024, // 2MB
            multiples: true
        })
    )
    serverHTTPS.use(
        plugins.bodyParser({
            mapFiles: true,
            maxFileSize: 2 * 1024 * 1024, // 2MB
            multiples: true
        })
    )
    server.use(pino())
    serverHTTPS.use(pino())

    return { server, serverHTTPS }
}

export { setup }
