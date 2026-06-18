import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseAuth: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      supabaseUser?: { id: string };
      accessToken?: string;
    }>();

    const token = extractBearerToken(request.headers.authorization);
    const user = await this.supabaseAuth.getUserFromToken(token);

    request.supabaseUser = user;
    request.accessToken = token;

    return true;
  }
}

function extractBearerToken(authorization?: string): string {
  if (!authorization?.startsWith('Bearer ')) {
    throw new UnauthorizedException('Token de autorización requerido');
  }

  const token = authorization.slice(7).trim();
  if (!token) {
    throw new UnauthorizedException('Token de autorización requerido');
  }

  return token;
}
