import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class AuthsService {
  constructor(private prismaService: PrismaService) {}

  async signup(signupAuthDto: SignupAuthDto) {
    const userExist = await this.prismaService.uSR.findFirst({
      where: { USR_EMAIL: signupAuthDto.email },
    });

    if (userExist) throw Error('the user already exists');

    return await this.prismaService.uSR.create({
      data: {
        USR_UUID: uuidv7(),
        USR_EMAIL: signupAuthDto.email,
        USR_NAME: signupAuthDto.name,
      },
    });
  }

  async login(email: string) {
    const userExist = await this.prismaService.uSR.findFirst({
      where: { USR_EMAIL: email },
    });

    if (!userExist) throw Error('user does not exist');

    return userExist.USR_UUID;
  }
}
