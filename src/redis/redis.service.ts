import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { getRedisConnectionToken } from '@nestjs-modules/ioredis';
dotenv.config({ path: '../config/.development.env' });

console.log('REDIS SERVICE! ');

@Injectable()
export class RedisService {
  // ioredis 에서는 하나의 인스턴스가 subscribe 되면 다른 명령(ex. get, set)은 실행 불가
  constructor(
    @Inject(getRedisConnectionToken('PUBLISHER')) private readonly pub: Redis,
    @Inject(getRedisConnectionToken('SUBSCRIBER')) private readonly sub: Redis,
  ) {}

  onModuleInit() {
    this.pub.on('error', (err) => {
      console.error('[Redis Publisher Error]', err);
    });

    this.sub.on('error', (err) => {
      console.error('[Redis Subscriber Error]', err);
    });
  }

  async subscribe(channel: string, callback: (msg: string) => void) {
    // Redis 클라이언트의 subscribe 메서드의 channel 인자에는 구독하려는 채널 목록을 'A', 'B' 문자열/commma 구분자 형식으로 넣기
    console.log('SUBSCRIBE');
    await this.sub.subscribe(channel);

    // 모든 채널에서 온 메시지를 다 받는다.
    this.sub.on('message', (ch, message) => {
      // 수신된 메시지(ch, message)가 현재 구독 중인 특정 채널(channel)에서 온 거니?
      if (ch === channel) callback(message);
    });
  }

  async publish(channel: string, message: string) {
    console.log('channel: ', channel);
    console.log('message: ', message);
    return await this.pub.publish(channel, message);
  }
}
