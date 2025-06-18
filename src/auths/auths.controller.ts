import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthsService } from './auths.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('/signup')
  async signup(@Body() signupAuthDto: SignupAuthDto, @Res() res: Response) {
    await this.authsService.signup(signupAuthDto);

    return res.status(200).json({ message: '등록 성공' });
  }

  @Post('/login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() res: Response) {
    const userUuid = await this.authsService.login(loginAuthDto.email);

    res.cookie('Authorization', userUuid, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 60 * 1000,
      sameSite: 'none',
      partitioned: true,
    });

    return res.status(200).json({ message: '로그인 성공' });
  }
}
