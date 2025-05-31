import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private primsaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.primsaService.uSR.findFirst({
      where: { USR_EMAIL: createUserDto.email },
    });

    if (userExist) throw Error('the user already exists');

    return await this.primsaService.uSR.create({
      data: {
        USR_UUID: uuidv7(),
        USR_NAME: createUserDto.name,
        USR_EMAIL: createUserDto.email,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
