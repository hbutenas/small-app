import { Body, Controller, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { GetCurrentUser, Public } from 'src/auth/decorators';
import { ForgotPasswordDto, LoginUserDto, RegisterUserDto, ResetPasswordDto } from 'src/auth/dto';
import { RefreshTokenGuard } from 'src/auth/guards';
import { User } from 'src/auth/types';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../services/auth/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: LoginUserDto): Promise<User> {
    return this.authService.login(body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@GetCurrentUser('email') email: string): Promise<boolean> {
    return this.authService.logout(email);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(@GetCurrentUser('refreshToken') refreshToken: string, @GetCurrentUser('email') email: string): Promise<User> {
    return this.authService.refresh(refreshToken, email);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public async forgotPassword(@Body() body: ForgotPasswordDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(body);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() body: ResetPasswordDto, @Query('token') token: string) {
    return this.authService.resetPassword(body, token);
  }
}
