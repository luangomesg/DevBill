import { Router } from 'express'

import baserouteController from './app/controllers/baseroute.controller'
import categoriesController from './app/controllers/categories.controller'
import transactionsController from './app/controllers/transactions.controller'

export const routes = Router()

routes.get('/', baserouteController.index)

routes.get('/categories', categoriesController.index)
routes.post('/categories', categoriesController.create)

routes.get('/transactions/dashboard', transactionsController.getDashboard)
routes.get('/transactions', transactionsController.index)
routes.post('/transactions', transactionsController.create)
