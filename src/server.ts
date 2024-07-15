import 'dotenv/config'
import cors from 'cors'
import express, { json } from 'express'

import { setupMongo } from './database'
import { errorHandler } from './middlewares/error-handler.middleware'
import { routes } from './routes'

const app = express()
const port = process.env.PORT || 4000

setupMongo().then(() => {
  app.use(
    cors({
      origin: process.env.FRONT_URL
    })
  )
  app.use(json())
  app.use(routes)
  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`APP is running at port ${port}`)
  })
})

export default app
