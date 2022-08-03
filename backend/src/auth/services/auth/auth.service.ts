import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto } from '../../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensType, User, UserPayloadType } from '../../../auth/types';

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

  public async login(body: LoginUserDto): Promise<User> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    // User does not exists
    if (!user) throw new BadRequestException('Email address or password is incorrect');

    // Compare passwords
    const passwordMatches = await bcrypt.compare(body.password, user.password);

    // Passwords does not match
    if (!passwordMatches) throw new BadRequestException('Email address or password is incorrect');

    // Create payload
    const userPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    // Generate tokens
    const tokens = await this.generateJwtTokens(userPayload);

    // Update the refreshToken
    await this.updateRefreshToken(userPayload.email, tokens.refreshToken);

    // Return user & tokens
    return { user: userPayload, tokens };
  }

  public async logout(email: string): Promise<boolean> {
    // Set users refreshToken to null
    try {
      await this.prisma['User'].update({
        where: {
          email,
        },
        data: {
          refreshToken: null,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong while logging out the user... Please try again later');
    }

    return true;
  }

  public async refresh(refreshToken: string, email: string): Promise<User> {
    // Find the user
    const user = await this.prisma['User'].findUnique({
      where: {
        email,
      },
    });

    // Couldn't find user or user's refresh token is null
    if (!user || !user.refreshToken) throw new ForbiddenException('Access denied');

    // Compare refresh token hash
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    // Tokens does not match
    if (!refreshTokenMatches) throw new ForbiddenException('Access denied');

    // Create payload
    const userPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

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
