import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RedisModule } from './redis.module';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.development.env' });

// https://docs.nestjs.com/microservices/basics
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RedisModule,
    {
      transport: Transport.REDIS,
      options: {
        host: String(process.env.REDIS_HOST),
        port: Number(process.env.REDIS_PORT),
        username: String(process.env.REDIS_USERNAME),
        password: String(process.env.REDIS_PASSWORD),
      },
    },
  );

  await app.listen();
  console.log('🚀 Redis microservice is running');
}

bootstrap();
