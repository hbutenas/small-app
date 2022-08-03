import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { AccessTokenJwtStrategy, RefreshTokenJwtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({}), MailModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenJwtStrategy, RefreshTokenJwtStrategy],
})
export class AuthModule {}
