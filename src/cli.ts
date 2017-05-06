#!/usr/bin/env node

import * as path from 'path'
import * as express from 'express'
import * as minimist from 'minimist'
import * as detectPort from 'detect-port'
import * as prompt from 'prompt'

import { middleware } from './middleware'

const isInteractive = process.stdout.isTTY
const argv = minimist(process.argv.slice(2))
const handlerArg = path.resolve(process.cwd(), argv._[0])
const exportKey = handlerArg.split('.').pop()
const handlerPath = handlerArg.split(`.${exportKey}`).shift()
const checkPort = parseInt(argv.port || process.env.PORT || 8080, 10)

const mod = require(handlerPath)  // tslint:disable-line
const handler = mod[exportKey]
const app = express()

async function start() {
  const port = await detectPortOrNextAvailable(checkPort)

  app.use(middleware(handler))

  const server = app.listen(port)

  console.info(`Start server at http://localhost:${port}.`) // tslint:disable-line
}

async function detectPortOrNextAvailable(desiredPort: number): Promise<number> {
  const port = await detectPort(desiredPort)

  if (port === desiredPort) return port

  const message = `Something is already running on port ${desiredPort}`

  if (isInteractive) {
    console.info()  // tslint:disable-line
    console.info(message) // tslint:disable-line
    console.info()  // tslint:disable-line
    console.info('Press enter to use the next available port:') // tslint:disable-line

    const nextPort = promptForPort(port)
    return nextPort
  } else {
    throw new Error(message)
  }
}

async function promptForPort(defaultPort: number): Promise<number> {
  prompt.start()
  prompt.message = ''

  const schema = {
    properties: {
      port: {
        required: true,
        default: defaultPort
      }
    }
  }

  return new Promise<number>((resolve, reject) => {
    prompt.get(schema, (err: Error, result: any) => {
      if (err) return reject(err)
      resolve(result.port)
    })
  })
}

start().then(null, console.error)
