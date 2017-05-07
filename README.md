# lambda-response

[![npm](https://img.shields.io/npm/v/@jschr/lambda-response.svg)](https://www.npmjs.com/package/@jschr/lambda-response)
[![Build Status](https://img.shields.io/travis/jschr/lambda-response/master.svg)](https://travis-ci.org/jschr/lambda-response)

Express-style API for sending responses from [Lambda Integration Proxy](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html) to API Gateway.

Includes a CLI tool and express middleware for local development.

## Install

```
npm install @jschr/lambda-response
```

## Usage

```js
import { Response } from '@jschr/lambda-response'

export default function handler(event, context) {
  const res = new Response()

  context.succeed(res.send('OK'))
  // => { statusCode: 200, body: 'OK' }

  context.succeed(res.json({ foo: bar }))
  // => { statusCode: 200, body: '{"foo":"bar"}' }

  context.succeed(res.status(404).json({ message: 'Not found.' }))
  // => { statusCode: 404, body: '{"message":"Not found."}' }

  context.succeed(res.redirect('https://github.com'))
  // => { statusCode: 302, headers: { Location: 'https://github.com'} } }
}
```

### Headers

Default headers can be passed when creating a new response:
```js

const headers = { 'Content-Type': 'application/json' }
const res = new Response({ headers })
```

Or on an instance:
```js

const res = new Response()
const headers = { 'Content-Type': 'application/json' }
res.set(headers)
```

### CORS

CORS is enabled by default. You can pass in cors options when creating a new response:
```js
const cors = { origin: 'example.com', methods: ['GET'], headers: ['X-Api-Key'] }
const res = new Response({ cors })
```

Check out the [tests](src/Response.spec.ts) for more examples.

## CLI

You can use the CLI for local development. If you've installed `@jschr/lambda-response` globally:

```bash
$ lambda-response foo/bar.default --port 8080
```

Where `foo/bar` is the path to your lambda handler and `default` is the exported function.

## Middleware
For advanced use cases you can use the `lambda-response` express middleware:

```js
import * as express from 'express'
import { middleware } from '@jschr/lambda-response'

import handler from './foo/bar'

const app = express()

app.use(middleware(handler))

app.listen(8080)
```