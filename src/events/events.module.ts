import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
