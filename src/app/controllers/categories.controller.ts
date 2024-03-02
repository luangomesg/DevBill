import { Request, Response } from 'express'

import CategoriesRepository from '../../database/repositories/categories.repository'
import { CreateCategoryDTO } from '../../dtos/categories.dto'
import categorySchema from '../schemas/category.schema'
import CategoriesService from '../services/categories.services'

class CategoriesController {
  async create(
    req: Request<unknown, unknown, CreateCategoryDTO>,
    res: Response
  ) {
    const { title, color } = req.body
    const service = new CategoriesService(
      new CategoriesRepository(categorySchema)
    )
    const result = await service.create({ title, color })

    return res.status(201).json(result)
  }
}

export default new CategoriesController()
