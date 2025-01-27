import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from './users.models';
import { UsersService } from './users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService, AuthService],
  controllers: [AuthController],
  exports: [UsersService],
})
export class UsersModule {}
