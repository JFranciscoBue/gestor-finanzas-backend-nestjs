import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './Category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

config({ path: '.env' });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: process.env.DDBB_USER,
      password: process.env.DDBB_PASSWORD,
      database: process.env.DDBB,
      port: process.env.DDBB_PORT as unknown as number,
      autoLoadEntities: true,
      entities: ['/dist/**/*.entity.js'],
      synchronize: true,
      logging: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Obtener la variable de entorno JWT_SECRET de .env
        signOptions: { expiresIn: '86400s' }, // Tiempo de expiracion de UN dia en segundos
      }),
      inject: [ConfigService],
    }),
    UserModule,
    CategoryModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
