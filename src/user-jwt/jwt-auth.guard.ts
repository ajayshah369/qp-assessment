import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserJwtPayload } from './jwt-payload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: UserJwtPayload = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.findByUuid(payload.uuid);
      if (!user) {
        throw new UnauthorizedException();
      }
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    try {
      if (request.headers.cookie) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, token] = request.headers.cookie
          .split(';')
          .map((c) => c.trim())
          .find((c) => c.startsWith('access_token='))
          ?.split('=');
        return token;
      }
    } catch (error) {
      Logger.error(error);
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
