import { Router } from 'express'

import baserouteController from './controllers/baseroute.controller'
import categoriesController from './controllers/categories.controller'

export const routes = Router()

routes.get('/', baserouteController.index)
routes.post('/categories', categoriesController.create)
