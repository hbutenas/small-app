import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto, ForgotPasswordDto, ResetPasswordDto } from '../../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensType, User, UserPayloadType } from '../../../auth/types';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService, private mailService: MailService) {}

  public async register(body: RegisterUserDto): Promise<User> {
    // Find user by email
    const user = await this.prisma['User'].findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    // User already exists, throw error
    if (user) throw new UnprocessableEntityException({ email: 'Email address is already taken.' });

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
    if (!user) throw new UnprocessableEntityException({ email: 'These credentials do not match our records.' });

    // Compare passwords
    const passwordMatches = await bcrypt.compare(body.password, user.password);

    // Passwords does not match
    if (!passwordMatches) throw new UnprocessableEntityException({ email: 'These credentials do not match our records.' });

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

  public async forgotPassword(body: ForgotPasswordDto): Promise<{ message: string }> {
    // Find the user
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // Couldn't find the user
    if (!user) throw new NotFoundException('Email address is invalid');

    // Generate random token for forgot password
    const token = crypto.randomBytes(10).toString('hex');

    // Hash the token
    const hashedToken = await this.hashData(token);

    // Save the data
    try {
      await this.prisma['ForgotPassword'].create({
        data: {
          forgotToken: hashedToken,
          userEmail: body.email,
          expiresAt: new Date(+new Date() + 60000 * 100), // 1 hour
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong while sending forgot email... Please try again later');
    }

    // Send the email
    await this.mailService.sendEmail(body.email, hashedToken);

    // Send a response to client
    return { message: 'Instructions how to reset password successfully sent' };
  }

  public async resetPassword(body: ResetPasswordDto, token: string): Promise<boolean> {
    // Find user by provided token
    const user = await this.prisma['ForgotPassword'].findFirst({
      where: {
        forgotToken: token,
      },
    });

    // Couldn't find the user
    if (!user) throw new NotFoundException('User did not made any request to reset password');

    // Get the dates when was the request to reset password created and when it should expire
    const createdAt = new Date(user.createdAt);
    const expiresAt = new Date(user.expiresAt);

    // If it's already expired
    if (createdAt > expiresAt) {
      try {
        // Clear the record
        await this.prisma['ForgotPassword'].delete({
          where: {
            userEmail: user.userEmail,
          },
        });
      } catch (e) {
        throw new InternalServerErrorException('Something went wrong while deleting user from table... Please try again later');
      }
      // Throw error
      throw new BadRequestException('Token is already expired');
    }

    // Compare passwords are they correct
    if (body.password !== body.confirmedPassword) throw new BadRequestException('Passwords does not match');

    // Change password, return true
    try {
      // Hash the provided password
      const hashedPassword = await this.hashData(body.password);

      // Update user
      await this.prisma['User'].update({
        where: {
          email: user.userEmail,
        },
        data: {
          password: hashedPassword,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong while resetting the password... Please try again later');
    }

    return true;
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
