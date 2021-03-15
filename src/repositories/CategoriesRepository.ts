/* eslint-disable no-console */
import { EntityRepository, getRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Data {
  category: string
}

interface DataId {
  category_id: string
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findCategory({ category }: Data): Promise<Category | null> {
    const categoryRepo = getRepository(Category)

    const findCategory = await categoryRepo.findOne({ where: { title: category } })

    return findCategory || null


  }

  public async findCategoryById({ category_id }: DataId): Promise<Category> {
    const categoryRepo = getRepository(Category)

    const findCategoryById = await categoryRepo.findOne({ where: { id: category_id } })

    return findCategoryById


  }
}

export default CategoriesRepository;
