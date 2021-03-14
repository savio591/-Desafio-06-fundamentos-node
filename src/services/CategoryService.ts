/* eslint-disable no-console */
import { getCustomRepository } from "typeorm";
import Category from "../models/Category";
import CategoriesRepository from "../repositories/CategoriesRepository";

interface CategoryRequest {
  category: string;
}

class CategoryService {
  private async execute({ category }: CategoryRequest): Promise<Category> {

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const createCategory = categoriesRepository.create({ title: category })

    await categoriesRepository.save(createCategory)

    return createCategory
  }

  public async verify({ category }: CategoryRequest): Promise<Category | null> {
    const categoriesRepo = new CategoriesRepository()

    const verifyCategory = await categoriesRepo.findCategory({ category })

    return verifyCategory || null
  }

  public async createCategory({ category }: CategoryRequest): Promise<Category> {
    const verifyCategory = await this.verify({ category })

    if (!verifyCategory) { // Se não existir a categoria ->
      const createCategory = await this.execute({ category })
      return createCategory
    }
    return verifyCategory
  }
}

export default CategoryService;
