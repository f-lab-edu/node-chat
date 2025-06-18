import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class ChatroomsService {
  constructor(private prismaService: PrismaService) {}

  async createChatroom(userUuid: string, memberUuids: string[]) {
    const users = await this.prismaService.uSR.findMany({
      where: { USR_UUID: { in: memberUuids } },
    });
    console.log('users: ', users);

    if (users.length !== memberUuids.length) {
      throw new BadRequestException(
        '존재하지 않는 사용자가 포함되어 있습니다.',
      );
    }

    const newRoom = await this.prismaService.cHAT_ROOM.create({
      data: {
        ROOM_UUID: uuidv7(),
        ROOM_NAME: new Date().toISOString(),
      },
    });
    console.log('newRoom: ', newRoom);

    const chatroomMembers: string[] = [...memberUuids, userUuid];
    console.log('chatroomMembers.length', chatroomMembers.length);

    chatroomMembers.map(
      async (userUuid) =>
        await this.prismaService.cHAT_ROOM_MEMBER.create({
          data: { ROOM_UUID: newRoom.ROOM_UUID, USR_UUID: userUuid },
        }),
    );
  }

  async getJoinedChatRooms(userUuid: string) {
    const chatrooms = await this.prismaService.cHAT_ROOM_MEMBER.findMany({
      select: { CHAT_ROOM: { select: { ROOM_UUID: true, ROOM_NAME: true } } },
      where: { USR_UUID: userUuid, USR_OUT_AT: null },
    });
    console.log('chatrooms: ', chatrooms);

    const listOfChatRooms = chatrooms.map((room) => room.CHAT_ROOM);

    return listOfChatRooms;
  }

  async leaveChatRoom(userUuid: string, chatRoomUuid: string) {
    const chatroomExist = await this.prismaService.cHAT_ROOM_MEMBER.findFirst({
      where: { USR_UUID: userUuid, ROOM_UUID: chatRoomUuid, USR_OUT_AT: null },
    });
    console.log('chatroomExist: ', chatroomExist);

    if (!chatroomExist) throw new Error('the chatroom does not exist');

    await this.prismaService.cHAT_ROOM_MEMBER.updateMany({
      data: { USR_OUT_AT: new Date() },
      where: { USR_UUID: userUuid, ROOM_UUID: chatRoomUuid, USR_OUT_AT: null },
    });
  }
}
