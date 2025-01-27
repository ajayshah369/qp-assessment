import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserJwtPayload } from '../user-jwt/jwt-payload.interface';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findByEmail(email, true);
    if (user && (await bcrypt.compare(password, user.password))) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  async login(user: UserEntity) {
    const payload: UserJwtPayload = { uuid: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
      message: 'Login successful',
      data: user,
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const payload: UserJwtPayload = { uuid: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
      message: 'Signup successful',
      data: user,
    };
  }
}
