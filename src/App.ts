import express from 'express'
import * as middlewares from './middlewares'
import config from './config/defatult'
import convertRoutes from './routes/converter'

export default class App {
  /**
   * Entry point function.
   */
  static async main() {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use(middlewares.cors)
    app.use(`/api/${config.apiVersion}`, convertRoutes)
    app.use(middlewares.error)
    app.listen(config.apiPort, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${config.apiPort}`)
    })

    return app
  }
}
