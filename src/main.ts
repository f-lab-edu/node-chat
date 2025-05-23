import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

//github.com/nestjs/nest/tree/master/sample/16-gateways-ws
// https://docs.nestjs.com/websockets/adapter
// https://github.com/nestjs/nest/blob/master/packages/platform-ws/adapters/ws-adapter.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  console.log(`Server ${port} is listening`);
}
bootstrap();
