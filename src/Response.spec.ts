import * as expect from 'expect'

import { Response } from './Response'

describe('Response', () => {
  it('should create with default cors options', () => {
    const res = new Response().toJSON()

    expect(res.headers['Access-Control-Allow-Origin']).toEqual(Response.defaultCorsOrigin)
    expect(res.headers['Access-Control-Allow-Methods']).toEqual(Response.defaultCorsMethods.join(','))
    expect(res.headers['Access-Control-Allow-Headers']).toEqual(Response.defaultCorsHeaders.join(','))
  })

  it('should create with provided cors options', () => {
    const cors = {
      origin: 'http://localhost',
      methods: ['GET', 'POST'],
      headers: ['Authorization']
    }

    const res = new Response({ cors }).toJSON()

    expect(res.headers['Access-Control-Allow-Origin']).toEqual(cors.origin)
    expect(res.headers['Access-Control-Allow-Methods']).toEqual(cors.methods.join(','))
    expect(res.headers['Access-Control-Allow-Headers']).toEqual(cors.headers.join(','))
  })

  it('should create with default headers', () => {
    const headers = { Authorization: 'Bearer token' }
    Response.defaultHeaders = headers
    const res = new Response().toJSON()

    expect(res.headers.Authorization).toEqual(headers.Authorization)
  })

  it('should create with provided headers', () => {
    const headers = { Authorization: 'Bearer token' }
    const res = new Response({ headers }).toJSON()

    expect(res.headers.Authorization).toEqual(headers.Authorization)
  })
})

describe('Response.status', () => {
  it('should set statusCode and return instance', () => {
    const statusCode = 200
    const res = new Response()
    const instance = res.status(statusCode)
    const json = res.toJSON()

    expect(instance).toEqual(res)
    expect(json.statusCode).toEqual(statusCode)
  })
})

describe('Response.set', () => {
  it('should merge headers and return instance', () => {
    const defaultHeaders = { Authorization: 'Bearer token' }
    const headers = { ContentType: 'application/javascript' }
    const res = new Response({ cors: false, headers: defaultHeaders })
    const instance = res.set(headers)
    const json = res.toJSON()

    expect(instance).toEqual(res)
    expect(json.headers).toEqual({
      ...defaultHeaders,
      ...headers
    })
  })
})

describe('Response.send', () => {
  it('should set body and return instance', () => {
    const body = 'OK'
    const res = new Response()
    const instance = res.send(body)
    const json = res.toJSON()

    expect(instance).toEqual(res)
    expect(json.body).toEqual(body)
  })
})

describe('Response.json', () => {
  it('should set JSON.stringify body and return instance', () => {
    const body = { foo: 'bar' }
    const res = new Response()
    const instance = res.json(body)
    const json = res.toJSON()

    expect(instance).toEqual(res)
    expect(json.body).toEqual(JSON.stringify(body))
  })
})

describe('Response.redirect', () => {
  it('should set location and return instance', () => {
    const location = 'http://localhost'
    const res = new Response()
    const instance = res.redirect(location)
    const json = res.toJSON()

    expect(instance).toEqual(res)
    expect(json.location).toEqual(location)
  })
})

describe('Response.toJSON', () => {
  it('should return serialized instance', () => {
    const statusCode = 200
    const body = 'OK'
    const headers = { Authorization: 'Bearer Token' }
    const cors = { origin: '*', methods: ['GET'], headers: ['Authorization'] }
    const res = new Response({ headers, cors })
    const instance = res.status(statusCode).send(body)
    const json = res.toJSON()

    expect(instance).toEqual(res)
    expect(json.statusCode).toEqual(statusCode)
    expect(json.body).toEqual(body)
    expect(json.headers).toEqual({
      ...headers,
      'Access-Control-Allow-Origin': cors.origin,
      'Access-Control-Allow-Methods': cors.methods.join(','),
      'Access-Control-Allow-Headers': cors.headers.join(',')
    })
  })

  it('should return only location if set', () => {
    const location = 'http://localhost'
    const res = new Response()
    const instance = res.redirect(location)
    const json = res.toJSON()

    expect(instance).toEqual(res)
    expect(json.location).toEqual(location)
    expect(Object.keys(json).length).toEqual(1)
  })
})
