import { Router } from 'express'

import categoriesController from '../controllers/categories.controller'

export const categoriesRoutes = Router()

categoriesRoutes.post('/', categoriesController.create)
