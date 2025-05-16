import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { RedisClientModule } from './redis/redis.client.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./config/.development.env'],
      isGlobal: true,
    }),
    EventsModule,
    RedisModule,
    RedisClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
