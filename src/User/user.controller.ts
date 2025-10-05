import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { IuserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
  async register(@Body() userData: IuserDto) {
    return await this.usersService.register(userData);
  }

  @Post('/auth/login')
  async login(@Body() userData: IuserDto) {
    return await this.usersService.login(userData);
  }
}
