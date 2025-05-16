import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(@Inject('REDIS_SERVICE') private readonly client: ClientProxy) {}

  async sendEvent(data: any) {
    return this.client.emit('my-test-event', data); // fire-and-forget
  }
}
