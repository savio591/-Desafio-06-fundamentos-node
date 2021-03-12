/* eslint-disable no-console */
import { getCustomRepository } from "typeorm";
import Category from "../models/Category";
import CategoriesRepository from "../repositories/CategoriesRepository";

interface CategoryRequest {
  category: string;
}

class CategoryService {
  public async execute({ category }: CategoryRequest): Promise<Category> {

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const createCategory = categoriesRepository.create({ title: category })

    await categoriesRepository.save(createCategory)
    
    return createCategory
  }
}

export default CategoryService;
