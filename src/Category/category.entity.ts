import { CategoryEnum } from 'src/enums/Category.enum';
import { Transaction } from 'src/transaction/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v7 as uuid } from 'uuid';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: CategoryEnum })
  type: CategoryEnum;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
