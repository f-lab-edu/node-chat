import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard, CustomRequest } from 'src/auth.guard';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/chat-candidates')
  async getChatCandidates(@Req() req: CustomRequest, @Res() res: Response) {
    const userUuid = req.user?.uuid as string;
    const candidates = await this.usersService.getChatCandidates(userUuid);

    return res.status(200).json({ result: candidates });
  }
}
