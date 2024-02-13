import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'nestjs-prisma';
import { JwtPayload } from 'src/contracts/jwt-payload/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('hello auth guard');

      // Try to retrieve the JWT from request's cookies
      //--------------------------------------------------------------------------
      const request: Request = context.switchToHttp().getRequest();

      const token: string = request.cookies['jwt'];
      console.log(token);

      if (!token) throw new UnauthorizedException();

      // Verify the JWT and check if it has been revoked
      //--------------------------------------------------------------------------
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        request.cookies['jwt'],
        { secret: process.env.JWT_SECRET },
      );
      console.log(payload);

      const isTokenRevoked = await this.prisma.revokedToken.findUnique({
        where: { jti: payload.jti },
      });
      if (isTokenRevoked) throw new UnauthorizedException();

      // Attach user's data to the request
      //--------------------------------------------------------------------------
      request.user = payload;

      return true;
    } catch (err: unknown) {
      console.error(err);

      throw new UnauthorizedException();
    }
  }
}
