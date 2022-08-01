import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensType, User, UserPayloadType } from 'src/auth/types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  public async register(body: RegisterUserDto): Promise<User> {
    // Find user by email
    const user = await this.prisma['User'].findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    // User already exists, throw error
    if (user) throw new BadRequestException(`Email address is taken`);

    // Hash the password
    const hashedPassword = await this.hashData(body.password);

    // Generate username
    const username = body.email.split('@')[0].toLowerCase() + Math.random().toString(36).slice(-5);

    // Create new user, the return will be a used for an actual payload for tokens
    let userPayload: UserPayloadType;

    try {
      userPayload = await this.prisma['User'].create({
        data: {
          email: body.email.toLowerCase(),
          password: hashedPassword,
          username,
        },
        select: {
          id: true,
          email: true,
          username: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong while creating new user... Please try again later');
    }

    // Generate tokens
    const tokens = await this.generateJwtTokens(userPayload);

    // Update the refreshToken
    await this.updateRefreshToken(userPayload.email, tokens.refreshToken);

    // Return user & tokens
    return { user: userPayload, tokens };
  }

  /** Helpers */
  private async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    // Hash refresh token
    const hashedRefreshToken = await this.hashData(refreshToken);

    // Update refresh token
    await this.prisma['User'].update({
      where: {
        email,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  private async generateJwtTokens(payload): Promise<TokensType> {
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('ACCESS_TOKEN'),
      expiresIn: 60 * 15, // 15min
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('REFRESH_TOKEN'),
      expiresIn: 60 * 60 * 24 * 7, // 1week
    });

    return { accessToken, refreshToken };
  }

  private async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }
}
