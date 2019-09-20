jest.mock('../hotel.controller')

import { codes } from '@constants/http.const'

import * as supertest from 'supertest'

import { Server } from 'restify'

import { createUrlContext } from '@utils/api.utils'

import { bootstrap } from '@/bootstrap'

import * as hotelController from '../hotel.controller'

describe.skip('Tests for Home controller', () => {
    const route = createUrlContext('hotel')
    let server: Server

    beforeAll(() => (server = bootstrap()))

    it('Should return a array of the Hotels when getAll has been called', async () => {
        const mockValue = {}
        hotelController.getAll = jest.fn(() => mockValue)

        const response = await supertest(server).get(route)
        const { body } = response

        expect(body).toEqual(mockValue)
        expect(hotelController.getAll).toHaveBeenCalledTimes(1)
    })
})
