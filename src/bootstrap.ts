import { compose } from 'ramda'
import { Server } from 'restify'

import { connect } from '@config/database.config'
import { create, init } from '@config/server.config'
import { routes } from '@config/routes.config'
import { seed } from '@config/seed.config'
import { setup } from '@config/api.config'

import '@config/firebase.config'

const bootstrap = compose(
    init,
    setup,
    routes,
    servers => {
        seed()
        return servers
    },
    servers => {
        connect()
        return servers
    },
    create
)

export { bootstrap }
