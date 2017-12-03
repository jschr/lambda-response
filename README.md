# lambda-response

[![npm](https://img.shields.io/npm/v/@jschr/lambda-response.svg)](https://www.npmjs.com/package/@jschr/lambda-response)
[![Build Status](https://img.shields.io/travis/jschr/lambda-response/master.svg)](https://travis-ci.org/jschr/lambda-response)

Express-like API for sending responses from [Lambda Integration Proxy](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html) to API Gateway.

Includes a CLI tool and express middleware for local development.

## Install

```
npm install @jschr/lambda-response
yarn add @jschr/lambda-response
```

## Usage

```js
const { Response } = require('@jschr/lambda-response')

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

```js

const headers = { 'Content-Type': 'application/json' }
const res = new Response({ headers })

const res = new Response()
const headers = { 'Content-Type': 'application/json' }
res.set(headers)
```
Default headers can be passed when creating a new response or set on an instance.

### CORS

```js
const cors = { origin: 'example.com', methods: ['GET'], headers: ['X-Api-Key'] }
const res = new Response({ cors })
```
CORS is enabled by default. Customize cors settings when creating a new response.

### Examples
With async/await
```js
const { Response } = require('@jschr/lambda-response')

async function route(req, res) {
  const data = await someAsyncFunction(req.query.id)

  if (data) {
    res.json(data)
  } else {
    res.status(404).json({ message: 'Not found'. })
  }
}

export default async function handler(event, context) {
  const req = { query: event.queryStringParameters || {} }
  const res = new Response()

  try {
    await route(req, res);
    context.succeed(res);
  } catch (err) {
    context.fail(err);
  }
}
```
Check out the [tests](src/Response.spec.ts) for more examples.

## CLI

You can use the CLI for local development if you've installed the package globally.

```bash
$ lambda-response foo/bar.default --port 8080
```
Where `foo/bar` is the path to your lambda handler and `default` is the exported function name.

## Middleware
```js
const server = require('express')()
const { middleware } = require('@jschr/lambda-response')

server.use(middleware(require('./foo/bar')))
```
Use the express middleware for custom servers.
