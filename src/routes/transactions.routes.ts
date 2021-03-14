/* eslint-disable no-console */
import { Router } from 'express';
import { getCustomRepository, TransactionRepository } from 'typeorm'
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoryService from '../services/CategoryService';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepo = new TransactionsRepository()

  const all = await transactionRepo.all()
  return response.json(all)
});


transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const transactionRepo = new TransactionsRepository()

    const transaction = await transactionRepo.createTransaction({
      title,
      value,
      type,
      category
    })

    return response.json(transaction)
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
