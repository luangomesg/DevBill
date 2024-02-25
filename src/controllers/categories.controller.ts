import { Request, Response } from 'express'

import CategoriesService from '../services/categories.services'

class CategoriesController {
  async create(_: Request, res: Response) {
    const result = await CategoriesService.create()

    return res.status(201).json(result)
  }
}

export default new CategoriesController()
