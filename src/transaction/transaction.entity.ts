import { Category } from 'src/Category/category.entity';
import { TransactionsEnum } from 'src/enums/Transactions.enum';
import { User } from 'src/User/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v7 as uuid } from 'uuid';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'enum', enum: TransactionsEnum })
  type: TransactionsEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
