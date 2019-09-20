import { config } from '@config/config'

import * as admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
        projectId: config.firebase.projectId
    })
})
