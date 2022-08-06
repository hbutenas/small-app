import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  LoginUserDto,
  RefreshTokenDto,
  RegisterUserDto,
  ResetPasswordDto,
} from 'src/auth/dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../services/auth/auth.service';
import { Public } from 'src/auth/decorators';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(
    @Body() body: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    return this.authService.resetPassword(body, token);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  public me(@Req() req) {
    const user = req.user as User;
    return this.authService.me(user);
  }
}
