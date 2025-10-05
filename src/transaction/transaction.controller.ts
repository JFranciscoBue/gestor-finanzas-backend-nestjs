import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ITransactionDataDto } from './transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionsService: TransactionService) {}

  @Get('/all')
  async findAllTransactions(@Req() req: any) {
    return this.transactionsService.findAllTransactions(req.user_id);
  }

  @Get('/findOne/:id')
  async findOneTransaction(@Param('id') transaction_id: string) {
    return await this.transactionsService.findOneTransaction(transaction_id);
  }

  @Get('/findByCategory/category?')
  async findTransactionsByCategory(
    @Query('category') category_id: string,
    @Req() req: any,
  ) {
    return await this.transactionsService.findTransactionsByCategory(
      category_id,
      req.user_id,
    );
  }

  @Get('/getUserBalance/:id')
  async getUserBalance(@Param('id') user_id: string) {
    return await this.transactionsService.getUserBalance(user_id);
  }

  @Post('/new/:id')
  async createTransaction(
    @Body() transactionData: ITransactionDataDto,
    @Param('id') user_id: string,
  ) {
    return await this.transactionsService.createTransaction(
      transactionData,
      user_id,
    );
  }

  @Patch('/edit/:id')
  async editTransaction(
    @Param('id') transaction_id: string,
    @Body() newData: Partial<ITransactionDataDto>,
  ) {
    return await this.transactionsService.editTransaction(
      transaction_id,
      newData,
    );
  }

  @Delete('delete/:id')
  async deleteTransaction(@Param('id') transaction_id: string) {
    return await this.transactionsService.deleteTransaction(transaction_id);
  }
}
