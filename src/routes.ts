import { Router } from 'express'

import baserouteController from './app/controllers/baseroute.controller'
import categoriesController from './app/controllers/categories.controller'

export const routes = Router()

routes.get('/', baserouteController.index)
routes.post('/categories', categoriesController.create)
