import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.all().reduce(
      (acc, transaction) =>
        transaction.type === 'income' ? acc + transaction.value : acc,
      0,
    );

    const outcome = this.all().reduce(
      (acc, transaction) =>
        transaction.type === 'outcome' ? acc + transaction.value : acc,
      0,
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    const { total } = this.getBalance();

    if (transaction.type === 'outcome' && transaction.value > total) {
      throw Error("Don't have enought value");
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
