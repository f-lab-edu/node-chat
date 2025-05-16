import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RedisListener {
  @EventPattern('my-test-event')
  handleMessage(@Payload() data: any) {
    console.log('📨 Received message from Redis:', data);
  }
}
