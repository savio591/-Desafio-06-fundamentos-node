/* eslint-disable no-console */
import { Router } from 'express';
import { getCustomRepository } from 'typeorm'
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoryService from '../services/CategoryService';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {

  const transactionsRepository = getCustomRepository(TransactionsRepository)

  const transactions = await transactionsRepository.find()

  const getbalance = new TransactionsRepository()

  const balance = getbalance.getBalance()

  console.log(balance)
  return response.json(
    balance
  )
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const createTransaction = new CreateTransactionService();
    const resolveCategory = new CategoryService();

    const categoryRel = resolveCategory.execute({ category })

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
    })

    return response.json([{"transaction": transaction}, {"category": categoryRel}])
  }

  catch (err) {
    return response.status(400).json({ error: err.message })
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
