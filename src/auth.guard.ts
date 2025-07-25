import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import Redis from 'ioredis';
import { PrismaService } from './prisma/prisma.service';

export interface CustomRequest extends Request {
  user?: {
    uuid: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private prismaService: PrismaService,
    @InjectRedis('SESSION')
    private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<CustomRequest>();

    const sessionIdEndcoded = req.cookies['SESSION'];
    if (!sessionIdEndcoded)
      throw new UnauthorizedException('인가 쿠키가 없습니다.');

    const sessionId = Buffer.from(sessionIdEndcoded, 'base64').toString(
      'utf-8',
    );
    const sessionData = await this.redis.hgetall(
      `spring:session:sessions:${sessionId}`,
    );
    const userUuid = JSON.parse(sessionData['sessionAttr:USR_UUID']);

    try {
      const userExist = await this.prismaService.uSR.findFirst({
        where: { USR_UUID: userUuid },
      });

      if (!userExist) throw Error('user does not exist');

      req.user = { uuid: userUuid };
      return true;
    } catch (error) {
      console.log('error: ', error);
      throw new UnauthorizedException('인가 과정에서 에러가 발생했습니다.');
    }
  }
}
