import { config } from '@config/config'

import * as fileType from 'file-type'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as uuid from 'uuid'

import { not } from './functions.utils'

const read = (image: string): Buffer => {
    const filePath = `${os.homedir()}/${config.api.name}/${image}`
    return fs.readFileSync(filePath)
}

const save = (body: Buffer) => {
    const { ext } = fileType(body)
    const fileName = `${uuid()}.${ext}`
    const filePath = `${os.homedir()}/${config.api.name}/`
    const destiny = path.join(filePath, fileName)
    if (not(fs.existsSync(filePath))) {
        fs.mkdirSync(filePath, { recursive: true })
    }
    const stream = fs.createWriteStream(destiny)
    stream.write(body)
    stream.end()
    return fileName
}

const saveWithBase64 = (base64: string, directory: string) => {
    const body = Buffer.from(base64, 'base64')
    const { ext } = fileType(body)
    const fileName = `${uuid()}.${ext}`
    const filePath = `${os.homedir()}/${config.api.name}/${directory}/`
    const destiny = path.join(filePath, fileName)
    if (not(fs.existsSync(filePath))) {
        fs.mkdirSync(filePath, { recursive: true })
    }
    const stream = fs.createWriteStream(destiny)
    stream.write(body)
    stream.end()
    return fileName
}

export { read, save, saveWithBase64 }
