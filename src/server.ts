import express from 'express'
import 'dotenv/config'

import database from './database'
import { routes } from './routes'

database.mongo().then(() => {
  const app = express()

  app.use(express.json())
  app.use(routes)

  app.listen(3333, () => console.log('🚀 app running on the port 3333'))
})
