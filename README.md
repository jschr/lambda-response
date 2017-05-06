# lambda-response

[![npm](https://img.shields.io/npm/v/@jschr/lambda-response.svg)](https://www.npmjs.com/package/@jschr/lambda-response)
[![Build Status](https://img.shields.io/travis/jschr/lambda-response/master.svg)](https://travis-ci.org/jschr/lambda-response)

Express-style API for sending responses from Lambda Integration Proxy / API Gateway.

Includes a cli tool and express middleware for local development.

## Install

```
npm install @jschr/lambda-response
```

## Usage

```js
import { Response } from '@jschr/lambda-response'

export default function handler(event, context) {
  const res = new Response()

  context.succeed(res.status(200).send('OK'))
  context.succeed(res.status(200).send('OK'))
  context.succeed(res.status(200).json({ foo: bar }))
  context.succeed(res.redirect('http://google.com'))
}
```

### Headers

Default headers can be passed when creating a new response:
```js

const headers = { 'Content-Type': 'application/javascript' }
const res = new Response({ headers })
```

Or on an instance:
```js

const res = new Response()
const headers = { 'Content-Type': 'application/javascript' }
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

import handler from 'foo/bar'

const app = express()

app.use(middleware(handler))

app.listen(8080)
```