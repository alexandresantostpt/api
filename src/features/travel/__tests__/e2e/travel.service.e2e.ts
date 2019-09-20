import { codes } from '@constants/http.const'

import * as supertest from 'supertest'

import { Server } from 'restify'

import { createUrlContext } from '@utils/api.utils'

import { bootstrap } from '@/bootstrap'

describe('Tests for Home controller', () => {
    const route = createUrlContext('hotel')
    let server: Server
    let newId = ''

    beforeAll(() => (server = bootstrap()))

    it('Should create a new registry when create has been called', async () => {
        const mockValue = { name: 'E2E testing' }
        const response = await supertest(server)
            .post(route)
            .send(mockValue)
        const { body, status } = response
        const { _id, name } = body
        newId = _id
        expect(name).toEqual(mockValue.name)
        expect(status).toEqual(codes.OK)
    })

    it('Should return a array of the Hotels when getAll has been called', async () => {
        const response = await supertest(server).get(route)
        const { status } = response
        expect(status).toEqual(codes.OK)
    })

    it('Should return a Hotel object when edit has been called', async () => {
        const response = await supertest(`${server}/$${newId}`).get(route)
        const { body, status } = response
        const { _id } = body
        expect(_id).toEqual(newId)
        expect(status).toEqual(codes.OK)
    })
})
