import * as express from 'express'

export interface ResponseJson {
  /** redirect location */
  location?: string
  /** status code of the response */
  statusCode?: number
  /** body of the response */
  body?: any
  /** headers of the response */
  headers?: any
}

export interface CorsOptions {
  /** allowed methods */
  methods?: string[],
  /** allowed headers */
  headers?: string[],
  /** allowed orgin */
  origin?: string
}

export interface ResponseOptions {
  /** cors options */
  cors?: CorsOptions,
  /** default headers */
  headers?: any
}

export class Response {
  public static defaultHeaders = {}
  public static defaultCorsOrigin = '*'
  public static defaultCorsMethods = [
    'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'
  ]
  public static defaultCorsHeaders = [
    'Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token'
  ]

  private location: string
  private statusCode: number
  private headers: any
  private body: any

  constructor(opts?: ResponseOptions) {
    opts = opts || { cors: {} }
    this.headers = opts.headers || Response.defaultHeaders

    if (opts.cors) {
      const allowedOrigin = opts.cors.origin || Response.defaultCorsOrigin
      const allowedMethods = opts.cors.methods || Response.defaultCorsMethods
      const allowedHeaders = opts.cors.headers || Response.defaultCorsHeaders

      this.headers['Access-Control-Allow-Origin'] = allowedOrigin
      this.headers['Access-Control-Allow-Methods'] = allowedMethods.join(',')
      this.headers['Access-Control-Allow-Headers'] = allowedHeaders.join(',')
    }
  }

  /** sets the status code of the response */
  public status(status: number): Response {
    this.statusCode = status
    return this
  }

  /** sets the headers of the response, merged with default headers */
  public set(headers: any): Response {
    Object.keys(headers).forEach((key) => {
      this.headers[key] = headers[key]
    })

    return this
  }

  /** sets the body of the response */
  public send(body: any): Response {
    this.body = body
    return this
  }

  /** sets the body of the response with JSON.stringify */
  public json(body: any): Response {
    this.body = JSON.stringify(body)
    return this
  }

  /** sets the location of the response */
  public redirect(location: string): Response {
    this.location = location
    return this
  }

  /** serialize */
  public toJSON(): ResponseJson {
    if (this.location) {
      return { location: this.location }
    } else {
      return {
        statusCode: this.statusCode,
        headers: this.headers,
        body: this.body
      }
    }
  }
}
