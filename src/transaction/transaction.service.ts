import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Between, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ITransactionDataDto } from './transaction.dto';
import { User } from 'src/User/user.entity';
import { Category } from 'src/Category/category.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly TransactionsRepostory: Repository<Transaction>,
    @InjectRepository(User)
    private readonly UsersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly CategoriesRepository: Repository<Category>,
  ) {}

  async findAllTransactions(user_id: string): Promise<Transaction[]> {
    const transactions: Transaction[] = await this.TransactionsRepostory.find({
      where: { user: { id: user_id } },
    });

    return transactions;
  }

  async findOneTransaction(transaction_id: string): Promise<Transaction> {
    const transaction = await this.TransactionsRepostory.findOne({
      where: { id: transaction_id },
      relations: ['user', 'category'],
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return transaction;
  }

  async findTransactionsByCategory(
    category_id: string,
    user_id: string,
  ): Promise<Transaction[]> {
    return this.TransactionsRepostory.find({
      where: { category: { id: category_id }, user: { id: user_id } },
    });
  }

  async getUserBalance(
    user_id: string,
  ): Promise<{ income: number; expense: number; balance: number }> {
    const transactions = await this.TransactionsRepostory.find({
      where: { user: { id: user_id } },
    });

    const income = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);

    return { income, expense, balance: income - expense };
  }

  async findByDateRange(
    user_id: string,
    start: Date,
    end: Date,
  ): Promise<Transaction[]> {
    return this.TransactionsRepostory.find({
      where: {
        user: { id: user_id },
        created_at: Between(start, end),
      },
    });
  }

  async createTransaction(
    transactionData: ITransactionDataDto,
    user_id: string,
  ): Promise<Transaction> {
    const user = await this.UsersRepository.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User not found');

    const category = await this.CategoriesRepository.findOne({
      where: { id: transactionData.category_id },
    });
    if (!category) throw new NotFoundException('Category not found');

    const newTransaction = this.TransactionsRepostory.create({
      ...transactionData,
      user,
      category,
    });

    return await this.TransactionsRepostory.save(newTransaction);
  }

  async editTransaction(
    transaction_id: string,
    newData: Partial<ITransactionDataDto>,
  ): Promise<UpdateResult> {
    try {
      const transaction = await this.TransactionsRepostory.findOne({
        where: { id: transaction_id },
      });

      if (!transaction)
        throw new NotFoundException('Transaction ID not is valid');

      const updatedDate = await this.TransactionsRepostory.update(
        transaction_id,
        newData,
      );

      if (updatedDate.affected != 1) throw new Error();

      return updatedDate;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteTransaction(transaction_id: string): Promise<DeleteResult> {
    try {
      const deletedResult =
        await this.TransactionsRepostory.delete(transaction_id);

      if (deletedResult.affected != 1) throw new Error();

      return deletedResult;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
