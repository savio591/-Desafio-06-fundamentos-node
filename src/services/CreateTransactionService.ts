/* eslint-disable no-console */
import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository'

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
}

interface Response {
  createTransaction: Transaction;
  createCategory: Category
}

class CreateTransactionService {
  public async execute({ title, value, type, category_id }: Request): Promise<Transaction> {

    const transactionRepository = getRepository(Transaction);

    const createTransaction = transactionRepository.create({ title, value, type, category_id})

    await transactionRepository.save(createTransaction)
    return createTransaction
  }
}

export default CreateTransactionService;
