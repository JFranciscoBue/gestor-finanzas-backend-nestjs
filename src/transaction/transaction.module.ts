import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { User } from 'src/User/user.entity';
import { Category } from 'src/Category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Category])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
