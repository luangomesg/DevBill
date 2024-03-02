import CategoriesRepository from '../../database/repositories/categories.repository'
import { CreateCategoryDTO } from '../../dtos/categories.dto'
import { Category } from '../entities/category.entity'

class CategoriesService {
  static create() {
    throw new Error('Method not implemented.')
  }

  constructor(private categoriesRepository: CategoriesRepository) {}

  public async create({ title, color }: CreateCategoryDTO): Promise<Category> {
    const category = new Category({
      title,
      color
    })

    const createdCategory = await this.categoriesRepository.create(category)

    return createdCategory
  }
}

export default CategoriesService
