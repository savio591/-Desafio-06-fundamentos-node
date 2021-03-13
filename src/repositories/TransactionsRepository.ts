import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public getBalance(): Balance {
    const result = {
      "income": 45,
      "outcome": 4,
      "total": 43
    }

    return result
  }

}

export default TransactionsRepository;
