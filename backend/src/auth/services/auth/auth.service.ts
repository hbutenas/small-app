import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  public async register(body: RegisterUserDto) {
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

    // Create new user
    try {
      return await this.prisma['User'].create({
        data: {
          email: body.email.toLowerCase(),
          password: hashedPassword,
          username,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong while creating new user... Please try again later');
    }
  }

  private async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }
}
