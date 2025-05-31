import { RedisModule } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { RedisService } from './redis/redis.service';
import { UsersModule } from './users/users.module';
// https://www.npmjs.com/package/@nestjs-modules/ioredis

import dotenv from 'dotenv';
import { PrismaModule } from './prisma/prisma.module';
dotenv.config({ path: '../config/.development.env' });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./config/.development.env'],
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule.forRootAsync(
      {
        useFactory: () => ({
          type: 'single',
          url: process.env.REDIS_URL,
        }),
      },
      'PUBLISHER',
    ),
    RedisModule.forRootAsync(
      {
        useFactory: () => ({
          type: 'single',
          url: process.env.REDIS_URL,
        }),
      },
      'SUBSCRIBER',
    ),
    EventsModule,
    RedisModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
