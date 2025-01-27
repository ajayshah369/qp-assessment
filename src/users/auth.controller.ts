import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Get,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UserJwtAuthGuard } from '../user-jwt/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login-dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const data = await this.authService.login(user);

    res.cookie('access_token', data.access_token, {
      httpOnly: true,
    });

    res.json(data);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async getAuth(@Request() req: any) {
    return {
      message: 'Auth success',
      data: req.user,
    };
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto, @Res() res: Response) {
    const data = await this.authService.signup(body);

    res.cookie('access_token', data.access_token, {
      httpOnly: true,
    });

    res.json(data);
  }
}
