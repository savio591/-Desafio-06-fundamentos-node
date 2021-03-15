/* eslint-disable no-console */
import { EntityRepository, Repository, getRepository } from 'typeorm';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import CategoryService from '../services/CategoryService';
import CreateTransactionService from '../services/CreateTransactionService';
import CategoriesRepository from './CategoriesRepository';

interface CategoryResponse {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date
}

interface TransactionsRepo {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: Category;
  created_at: Date;
  updated_at: Date;
}

interface Odio {
  transactions: TransactionsRepo
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome'
  value: number;
  category: string;
}

interface GetTransactionDTO {
  transactions: Odio[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction[]> {
  private async getBalance(): Promise<Balance> {
    const transactionRepo = getRepository(Transaction)

    const balanceRepo = await transactionRepo.find()

    const { income, outcome } = await balanceRepo.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      })

    const total = income - outcome;
    return { income, outcome, total };
  }

  public async all(): Promise<GetTransactionDTO> {
    const transactionsRepo = getRepository(Transaction)

    const getTransactions = await transactionsRepo.find()

    const transactionsMap = getTransactions.map(async (
      { title,
        type,
        value,
        category_id,
        id,
        created_at,
        updated_at
      }: Transaction): Promise<TransactionsRepo> => {
      const categoryService = new CategoriesRepository()
      const category = await categoryService.findCategoryById({ category_id })

      return {
        title,
        type,
        value,
        category,
        id,
        created_at,
        updated_at
      }
    });

    const transactions = transactionsMap

    const getBalanceRel = await this.getBalance()

    return { transactions, 'balance': getBalanceRel }
  }

  public async createTransaction({ title, type, value, category }: CreateTransactionDTO): Promise<Transaction> {
    const categoryService = new CategoryService()
    const categoryRel = await categoryService.createCategory({ category })

    const transactionService = new CreateTransactionService()
    const transaction = await transactionService.execute({ title, type, value, category_id: categoryRel.id })

    return transaction
  }

}

export default TransactionsRepository;
