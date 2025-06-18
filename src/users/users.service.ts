import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getChatCandidates(userUuid: string) {
    const userExist = await this.prismaService.uSR.findFirst({
      where: { USR_UUID: userUuid },
    });

    if (!userExist) throw Error('the user do not exist');

    const list = await this.prismaService.uSR.findMany({
      select: { USR_EMAIL: true, USR_NAME: true, USR_UUID: true },
      where: { NOT: { USR_UUID: userUuid } },
    });
    console.log('list: ', list);

    return list;
  }
}
