import * as admin from 'firebase-admin'

const sendNotification = (body: string, title: string, topic: string, data: any = {}) => {
    admin.messaging().send({
        data,
        notification: {
            body,
            title
        },
        topic
    })
}

export { sendNotification }
