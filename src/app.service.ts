import { Injectable, Inject } from '@nestjs/common';

console.log('APP SERVICE! ');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
