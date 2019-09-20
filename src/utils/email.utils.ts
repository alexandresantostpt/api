import * as nodemailer from 'nodemailer'

import { config } from '@config/config'

const createTransport = (email: string, password: string) =>
    nodemailer.createTransport({
        auth: {
            pass: password,
            user: email
        },
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure
    })

const sendEmail = async (options: nodemailer.SendMailOptions) => {
    const mail = createTransport(config.mail.auth.user, config.mail.auth.pass)
    return mail.sendMail(options)
}

export { sendEmail }
