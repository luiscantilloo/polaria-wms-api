import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../../core/auth/supabase-auth.guard';
import {
  CurrentAccessToken,
  CurrentSupabaseUser,
} from '../../shared/decorators/current-user.decorator';
import type { User } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PreloginDto } from './dto/prelogin.dto';
import type { LoginResponse, MeResponse, PreloginResponse } from './interfaces/auth.interfaces';
import { Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('prelogin')
  @HttpCode(HttpStatus.OK)
  prelogin(@Body() dto: PreloginDto): Promise<PreloginResponse> {
    return this.authService.prelogin(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getMe(@CurrentSupabaseUser() user: User): Promise<MeResponse> {
    return this.authService.getMe(user.id);
  }

  @Post('logout')
  @UseGuards(SupabaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentAccessToken() accessToken: string): Promise<void> {
    await this.authService.logout(accessToken);
  }
}
