import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser, Public } from '../../decorators';
import { LoginUserDto, RegisterUserDto } from '../../dto';
import { RefreshTokenGuard } from '../../guards';
import { User } from '../../../auth/types';
import { AuthService } from '../../services/auth/auth.service';

@Controller('api/v1/auth')
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
}
