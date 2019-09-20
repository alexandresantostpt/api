import API from './api.type'
import APP from './app.type'
import DB from './db.type'
import Firebase from './firebase.type'
import Mail from './mail.type'
import Places from './places.type'
import Services from './services.type'

interface EnvType {
    api: API
    app: APP
    db: DB
    firebase: Firebase
    mail: Mail
    places: Places
    services: Services
}

export default EnvType
