import { TransactionsEnum } from 'src/enums/Transactions.enum';

export interface ITransactionDataDto {
  amount: number;
  type: TransactionsEnum;
  category_id: string;
  date?: Date;
}
