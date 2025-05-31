import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from './prisma/prisma.service';

export interface CustomRequest extends Request {
  user?: {
    uuid: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<CustomRequest>();

    const userUuid = req.cookies['Authorization'];
    if (!userUuid) throw new UnauthorizedException('인가 쿠키가 없습니다.');

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
