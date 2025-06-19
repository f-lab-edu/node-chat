import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

//github.com/nestjs/nest/tree/master/sample/16-gateways-ws
// https://docs.nestjs.com/websockets/adapter
// https://github.com/nestjs/nest/blob/master/packages/platform-ws/adapters/ws-adapter.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://127.0.0.1:5501'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 프로퍼티 자동 제거
      forbidNonWhitelisted: true, // DTO에 없는 프로퍼티가 있으면 에러 발생
      transform: true, // 자동으로 JSON 같은 평범한 객체 데이터를 DTO 클래스의 인스턴스 객체로 변환
    }),
  );

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  console.log(`Server ${port} is listening`);
}
bootstrap();
