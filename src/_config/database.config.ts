import { config } from './config'

import * as mongoose from 'mongoose'

mongoose.set('runValidators', true)

const connect = () => {
    const { db } = config
    const { host, name, password, port, user } = db

    mongoose.connect(`mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`, {
        authMechanism: 'SCRAM-SHA-1',
        useNewUrlParser: true
    })
    mongoose.connection.on('connected', () => console.log(`[Mongoose] => Connected at database: ${name}`))
    mongoose.connection.on('disconnected', () => console.log(`[Mongoose] => Disconnected at database: ${name}`))
    mongoose.connection.on('error', error =>
        console.log(`[Mongoose] => An error happened on trying to connected at database: ${name}, ${error}`)
    )

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log(`[Mongoose] => Disconnected at database ${name} because application finished`)
            process.exit(0)
        })
    })
}

export { connect }
