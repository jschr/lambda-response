import * as express from 'express'

export interface Context {
  succeed: (res: any) => void
  fail: (err: any) => void
}

export type Handler = (event: any, context: Context) => void

export function middleware(handler: Handler) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const event = {
      queryStringParameters: req.query,
      body: req.body
    }

    const context: Context = {
      succeed: (response) => {
        if (response.location) {
          res.redirect(response.location)
        } else if (response.statusCode) {
          res.status(response.statusCode)
            .set(response.headers)
            .send(response.body)
        } else {
          res.send(res)
        }
      },
      fail: (err) => next(err)
    }

    handler(event, context)
  }
}
