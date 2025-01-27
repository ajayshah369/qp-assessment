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
import { AdminsService } from './admins.service';
import { AdminJwtAuthGuard } from '../admin-jwt/jwt-auth.guard';
import { AdminLoginDto } from './dto/admin-login-dto';

@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminsService: AdminsService,
  ) {}

  @Post('login')
  async login(@Body() body: AdminLoginDto) {
    const admin = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(admin);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async getAuth(@Request() req: any) {
    return {
      message: 'Auth success',
      data: req.user,
    };
  }
}
