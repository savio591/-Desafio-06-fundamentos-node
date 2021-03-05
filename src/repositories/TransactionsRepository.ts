import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance = await new Repository()
    return {
      "income": 0,
      "outcome": 0,
      "total": 0
    }
  }
}

export default TransactionsRepository;
