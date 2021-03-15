/* eslint-disable no-console */
import fs from 'fs'
import csvParse from 'csv-parse';
import { getCustomRepository, getRepository, In } from 'typeorm';


import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}


class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {

    const contactsReadStream = fs.createReadStream(filePath)
    const categoriesRepository = getRepository(Category)
    const transactionsRepository = getRepository(Transaction)

    const parsers = csvParse({
      from_line: 2,
    })

    const parseCSV = contactsReadStream.pipe(parsers)

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map(
        (cell: string) => cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category)
      transactions.push({
        title,
        type,
        value,
        category
      })
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find(
      {
        where: {
          title: In(categories)
        },
      }
    )

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title)

    const addCategoryTitles = categories.filter(
      category => !existentCategoriesTitles.includes(category)
    ).filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(addCategoryTitles.map(title => ({
      title,
    })))

    await categoriesRepository.save(newCategories)

    const finalCategories = [...newCategories, ...existentCategories]

    const createdTransactions = transactionsRepository.create(transactions.map(transaction => {
      const categoryFinder = finalCategories.find(category => category.title === transaction.category)

      return {
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category_id: categoryFinder?.id
      }
    }))

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions
  }
}

export default ImportTransactionsService
