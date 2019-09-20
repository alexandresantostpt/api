interface Mail {
    auth: {
        pass: string
        user: string
    }
    host: string
    port: number
    secure: boolean
}

export default Mail
