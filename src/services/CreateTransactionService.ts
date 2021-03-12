import { getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository'

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {

    const transactionRepository = getCustomRepository(TransactionsRepository);

    const createTransaction = transactionRepository.create({ title, value, type })

    await transactionRepository.save(createTransaction)

    return createTransaction
  }
}

export default CreateTransactionService;
