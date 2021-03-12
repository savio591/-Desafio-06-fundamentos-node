/* eslint-disable no-console */
import { Router } from 'express';
import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {

  const transactionsRepository = getCustomRepository(TransactionsRepository)

  const transactions = await transactionsRepository.find()

  // eslint-disable-next-line no-console
  console.log(transactions)

  return response.json(
    transactions
  )
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;


    console.log(`Request received: ${request.body.parseJSON()}`)

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category
    })

    return response.json(transaction)
  }

  catch (err) {
    return null // por enquanto
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
