import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  RegisterUserDto,
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from '../../dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { ValidationErrorException } from 'common/exception/validation.exception';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}

  public async register(body: RegisterUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    if (user) {
      throw new ValidationErrorException({
        email: 'Email address is already taken.',
      });
    }

    const hashedPassword = await this.hash(body.password);

    const createdUser = await this.prisma.user.create({
      data: {
        ...body,
        email: body.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return this.generateTokens(createdUser);
  }

  public async login(loginDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email.toLowerCase(),
      },
    });

    if (!user) {
      throw new ValidationErrorException({
        email: 'These credentials do not match our records.',
      });
    }

    const passwordsMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordsMatches) {
      throw new ValidationErrorException({
        email: 'These credentials do not match our records.',
      });
    }

    return this.generateTokens(user);
  }

  public async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      const token: any = this.jwt.verify(refreshTokenDto.token);
      // we specifically sign refreshToken with type 'refresh'
      if (token.type !== 'refresh') throw new UnauthorizedException();
      const user = await this.prisma.user.findUnique({
        where: { id: token.sub },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { refreshToken, ...rest } = this.generateTokens(user);
      return rest;
    } catch (e) {
      // token is not signed by us
      throw new UnauthorizedException();
    }
  }

  public async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) throw new NotFoundException();

    const token = crypto.randomBytes(20).toString('hex');

    await this.prisma.forgotPassword.create({
      data: {
        token: token,
        email: body.email,
        expiresAt: new Date(+new Date() + 60000 * 100), // 1 hour
      },
    });

    await this.mailService.sendEmail(body.email, token);
    return { message: 'Instructions how to reset password successfully sent' };
  }

  public async resetPassword(body: ResetPasswordDto, token: string) {
    const forgotPassword = await this.prisma.forgotPassword.findFirst({
      where: { token },
      include: { user: true },
    });

    if (!forgotPassword) throw new NotFoundException();

    const createdAt = new Date(forgotPassword.createdAt);
    const expiresAt = new Date(forgotPassword.expiresAt);

    if (createdAt > expiresAt) {
      // TODO : make a cron job to delete forgot passwords that are expired
      throw new BadRequestException('Token is already expired');
    }

    const hashedPassword = await this.hash(body.password);
    await this.prisma.user.update({
      where: {
        email: forgotPassword.email,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  public me(user: User) {
    delete user.password;
    return user;
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(
      { ...payload, type: 'refresh' },
      {
        expiresIn: '1w',
      },
    );
    delete user.password;

    return { accessToken, refreshToken, user };
  }

  private async hash(data: string) {
    return await bcrypt.hash(data, 10);
  }
}
