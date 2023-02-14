import * as dotenv from 'dotenv'
dotenv.config()

function die(what: Error | string): never {
  if (typeof what === 'string') {
    throw new Error(what)
  }
  throw what
}

const config = {
  apiPort: process.env.RESTAPI_PORT ?? die('Environment variable "RESTAPI_PORT" wasn\'t defined!'),
  apiVersion: process.env.API_VERSION ?? die('Environment variable "API_VERSION" wasn\'t defined!'),
}
export default config
