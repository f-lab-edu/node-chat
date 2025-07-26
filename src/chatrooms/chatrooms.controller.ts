import {
  Controller,
  Get,
  Body,
  Patch,
  Res,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard, CustomRequest } from 'src/auth.guard';
import { ChatroomsService } from './chatrooms.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';

@UseGuards(AuthGuard)
@Controller('chatrooms')
export class ChatroomsController {
  constructor(private readonly chatroomsService: ChatroomsService) {}

  @Get('/list')
  async getJoinedChatRooms(@Req() req: CustomRequest, @Res() res: Response) {
    const userUuid = req.user?.uuid as string;
    const list = await this.chatroomsService.getJoinedChatRooms(userUuid);
    console.log('list: ', list);

    return res.status(200).json({ result: list });
  }

  @Post('/add')
  async createChatRoom(
    @Body() createChatroomDto: CreateChatroomDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    const userUuid = req.user?.uuid as string;

    await this.chatroomsService.createChatroom(
      userUuid,
      createChatroomDto.memberUuids,
      createChatroomDto.roomName,
    );

    return res.status(200).json({ result: 'success' });
  }

  @Patch('/:roomUuid/leave')
  async leaveChatRoom(
    @Body() chatroomUuid: string,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    const userUuid = req.user?.uuid as string;
    this.chatroomsService.leaveChatRoom(userUuid, chatroomUuid);

    return res.status(200).json({ message: '채팅방 나가기 성공' });
  }
}
