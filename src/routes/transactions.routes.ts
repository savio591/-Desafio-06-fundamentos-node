/* eslint-disable no-console */
import { Router } from 'express';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload'
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig)
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
    return response.status(400).json({ 'message': err.message, 'status': 'error' })
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const deleteService = new DeleteTransactionService()

    await deleteService.execute(id)

    return response.status(204).json({})
  }
  catch (err) {
    return response.status(400).json({ 'message': err.message, 'status': 'error' })
  }

});


transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    try {
      const importService = new ImportTransactionsService()

      await importService.execute(request.file.path)

      return response.status(200).json()
    }

    catch (err) {
      return response.status(400).json({ 'message': err.message, 'status': 'error' })
    }
  });

export default transactionsRouter;
