import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { IuserDto, IuserLoginDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UsersRepository: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(userData: IuserDto): Promise<User> {
    const { password, confirmPassword } = userData;

    if (password !== confirmPassword) throw new BadRequestException();

    const addingUser: User = this.UsersRepository.create(userData);

    const hashedPassword: string = await bcrypt.hash(password, 10);

    await this.UsersRepository.save({
      ...addingUser,
      password: hashedPassword,
    });

    return addingUser;
  }

  async login(userData: IuserLoginDto): Promise<Object> {
    const { email } = userData;

    const user = await this.UsersRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException();

    const rightPassword: Boolean = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!rightPassword) throw new BadRequestException();

    const token: string = this.jwt.sign({
      id: user.id,
      email: user.email,
    });

    return { token, user };
  }
}
