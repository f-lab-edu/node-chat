import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { RedisListener } from './redis.listener';

@Global()
@Module({
  controllers: [RedisListener, RedisController],
  providers: [RedisService],
})
export class RedisModule {}
