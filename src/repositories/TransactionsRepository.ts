/* eslint-disable no-console */
import { EntityRepository, Repository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

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
  transactions: Transaction[];
  balance: Balance;
}

interface Id {
  id: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  // public async findId({ id }: Id): Promise<Transaction | null> {
  //   const categoryRepo = this.findByIds(ids: {id})

  //   const findCategory = await categoryRepo.findOne({ where: { title: category } })

  //   return findCategory || null


  // }

  private async getBalance(): Promise<Balance> {

    const getTransactions = getRepository(Transaction)
    const balanceRepo = await getTransactions.find()

    const { income, outcome } = balanceRepo.reduce(
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

    const getBalanceRel = await this.getBalance()

    return { 'transactions': getTransactions, 'balance': getBalanceRel }
  }

  public async createTransaction({ title, type, value, category }: CreateTransactionDTO): Promise<Transaction> {
    const categoryService = new CategoryService()
    const transactionService = new CreateTransactionService()
    const categoryRel = await categoryService.createCategory({ category })
    const myBalance = await this.getBalance()

    if (type === "outcome" === value >= myBalance.total) {
      throw new AppError('você não tem bufunfa, amigo!')
    }

    const transaction = await transactionService.execute({ title, type, value, category_id: categoryRel.id })
    return transaction


  }

}

export default TransactionsRepository;
