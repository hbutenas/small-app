import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Seeder } from './seeder.seeder';

export class UserSeeder extends Seeder {
  async seed(prisma: PrismaClient): Promise<void> {
    await prisma.user.create({
      data: {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: await bcrypt.hash('password', 10),
      },
    });
  }
}
