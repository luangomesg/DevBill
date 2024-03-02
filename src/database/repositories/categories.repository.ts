import categorySchema from '../../app/schemas/category.schema'
import { Category } from '../../app/entities/category.entity'

class CategoriesRepository {
  constructor(private model: typeof categorySchema) {}

  async create({ title, color }: Category): Promise<Category> {
    const createCategory = await this.model.create({ title, color })

    return createCategory.toObject<Category>()
  }
}

export default CategoriesRepository
