import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from 'src/utils/catch-async';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  onModuleInit = catchAsync(async () => {
    await this.$connect();
    this.logger.log('Prisma connected!');
  });

  onModuleDestroy = catchAsync(async () => {
    await this.$disconnect();
    this.logger.log('Prisma disconnected!');
  });
}
