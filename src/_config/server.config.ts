import { config } from './config'

import { environments } from '@constants/environments.const'

import * as fs from 'fs'
import * as os from 'os'

import { Server, createServer } from 'restify'

import { start } from '@config/job.config'

const isProduction = config.api.environment === environments.production

const certificate = isProduction ? fs.readFileSync(`${os.homedir()}/exploreitapp.crt`) : null
const key = isProduction ? fs.readFileSync(`${os.homedir()}/exploreitapp.key`) : null
const port: number = config.api.port
const portSSL: number = config.api.portSSL
const host: string = config.api.host

const options = {
    name: config.api.name,
    version: config.api.version
}

const httpsOptions = {
    ...options,
    certificate,
    key
}

const create = () => ({
    server: createServer(options),
    serverHTTPS: createServer(httpsOptions)
})

const init = ({ server, serverHTTPS }) => {
    server.listen(port, host, () => {
        console.log(`[Restify] => Server running, to access it go to http://${host}:${port}`)
        console.log('[Restify] => Use CTRL+C to stop it')
    })
    if (isProduction) {
        serverHTTPS.listen(portSSL, host, () => {
            console.log(`[Restify] => HTTPS Server running, to access it go to https://${host}:${portSSL}`)
            console.log('[Restify] => Use CTRL+C to stop it')
        })
    }
    start()
    return server
}

export { create, init }
