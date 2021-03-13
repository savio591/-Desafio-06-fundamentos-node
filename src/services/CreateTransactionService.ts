/* eslint-disable no-console */
import { getCustomRepository } from 'typeorm';
import Category from '../models/Category';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository'

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Response {
  createTransaction: Transaction;
  createCategory: Category
}

class CreateTransactionService {
  public async execute({ title, value, type }: Request): Promise<any> {

    const transactionRepository = getCustomRepository(TransactionsRepository);

    const createTransaction = transactionRepository.create({ title, value, type })

    console.log(`[CTS] ${createTransaction}`)
    await transactionRepository.save(createTransaction)

    return createTransaction
  }
}

export default CreateTransactionService;
