import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AdminJwtPayload } from './jwt-payload.interface';
import { AdminsService } from 'src/admins/admins.service';

@Injectable()
export class AdminJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private adminsService: AdminsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: AdminJwtPayload = await this.jwtService.verifyAsync(token);
      const user = await this.adminsService.findByUuid(payload.uuid);
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
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
