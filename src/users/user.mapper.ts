// users/mappers/user.mapper.ts
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.models';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

export class UserMapper {
  static toEntity(userDto: CreateUserDto | UpdateUserDto): UserEntity {
    return {
      first_name: userDto.first_name,
      last_name: userDto.last_name,
      email: userDto.email,
      password: userDto.password,
    };
  }

  static toModel(userEntity: UserEntity): Partial<User> {
    return {
      first_name: userEntity.first_name,
      last_name: userEntity.last_name,
      email: userEntity.email,
      password: userEntity.password,
      is_active: userEntity.is_active,
    };
  }

  static modelToEntity(
    userModel: User,
    withPassword: boolean = false,
    withId: boolean = false,
  ): UserEntity {
    return {
      ...(withId && { id: userModel.id }),
      uuid: userModel.uuid,
      first_name: userModel.first_name,
      last_name: userModel.last_name,
      email: userModel.email,
      password: withPassword ? userModel.password : undefined,
      is_active: userModel.is_active,
    };
  }
}
