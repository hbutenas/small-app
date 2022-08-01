import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto';
import { AuthService } from '../../services/auth/auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Public
  @Post('register')
  public async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  // Public
  @Post('login')
  public async login() {
    // Todo
  }

  // Protected
  @Post('logout')
  public async logout() {
    // Todo
  }

  // Protected
  @Post('refresh')
  public async refresh() {
    // Todo
  }
}
