/* eslint-disable no-console */
import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Data {
  category: string
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findCategory({ category }: Data): Promise<void> {
    const categoryRepo = new Repository()

    const findCategory = await categoryRepo.findOne({ where: { title: category } })

    console.log(findCategory)
  }
}

export default CategoriesRepository;
