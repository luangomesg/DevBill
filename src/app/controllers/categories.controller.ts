import { Request, Response } from 'express'
import { z } from 'zod'

import { CreateCategoryDTO } from '../../dtos/categories.dto'
import categorySchema from '../schemas/category.schema'

class CategoriesController {
  async create(
    request: Request<unknown, unknown, CreateCategoryDTO>,
    response: Response
  ): Promise<Response> {
    const schema = z.object({
      title: z.string(),
      color: z.string().regex(/^#[A-Fa-f0-9]{6}$/)
    })

    try {
      schema.parse(request.body)
    } catch (err) {
      return response.status(400).json({ error: 'Invalid color code' })
    }

    const { title, color } = request.body

    const categoryExists = await categorySchema.findOne({ title })

    if (!title || !color) {
      return response
        .status(400)
        .json({ error: 'Title and color are required' })
    }
    if (categoryExists) {
      return response.status(409).json({ error: 'category already exists' })
    }

    const createdCategory = await categorySchema.create({ title, color })

    const result: CreateCategoryDTO = {
      title: createdCategory.title!,
      color: createdCategory.color!
    }

    return response.status(201).json(result)
  }

  async index(request: Request, response: Response): Promise<Response> {
    const categories: CreateCategoryDTO[] = await categorySchema.find()
    return response.json(categories)
  }
}

export default new CategoriesController()
