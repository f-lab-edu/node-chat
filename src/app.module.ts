import { RedisModule } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { RedisService } from './redis/redis.service';
// https://www.npmjs.com/package/@nestjs-modules/ioredis

console.log('APP MODULE! ');

import dotenv from 'dotenv';
dotenv.config({ path: '../config/.development.env' });

console.log('process.env.REDIS_URL: ', process.env.REDIS_URL);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./config/.development.env'],
      isGlobal: true,
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
