import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UserJwtAuthGuard } from '../user-jwt/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: UserLoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
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
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }
}
