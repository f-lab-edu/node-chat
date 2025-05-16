// redis-client.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.development.env' });

console.log('redis.client.module !!');
console.log('process.env.REDIS_HOST: ', process.env.REDIS_HOST);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: String(process.env.REDIS_HOST),
          port: Number(process.env.REDIS_PORT),
          username: String(process.env.REDIS_USERNAME),
          password: String(process.env.REDIS_PASSWORD),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RedisClientModule {}
