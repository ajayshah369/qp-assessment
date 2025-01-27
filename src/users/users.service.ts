import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './users.models';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userEntity = UserMapper.toEntity(createUserDto);
    const userModel = await this.userModel.create(
      UserMapper.toModel(userEntity),
    );
    return UserMapper.modelToEntity(userModel);
  }

  async findByEmail(
    email: string,
    withPassword: boolean = false,
  ): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ where: { email } });
    return user ? UserMapper.modelToEntity(user, withPassword) : null;
  }

  async findByUuid(
    uuid: string,
    withId: boolean = false,
  ): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ where: { uuid } });
    return user ? UserMapper.modelToEntity(user, false, withId) : null;
  }

  async update(
    uuid: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const result = await this.userModel.update(
      UserMapper.toModel(updateUserDto),
      { where: { uuid }, returning: true },
    );

    if (result[0] === 0) {
      return null;
    }

    const updatedUser = result[1][0];
    return updatedUser ? UserMapper.modelToEntity(updatedUser) : null;
  }
}
