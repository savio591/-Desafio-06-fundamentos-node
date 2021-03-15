import { getRepository } from "typeorm";

import Transaction from "../models/Transaction";
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepo = getRepository(Transaction)

    const findByTransactionId = await transactionsRepo.findOne(id)

    if (!findByTransactionId) {
      throw new AppError('Transação não encontrada')
    }

    await transactionsRepo.remove(findByTransactionId)
  }
};

export default DeleteTransactionService;
