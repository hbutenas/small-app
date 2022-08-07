import { PrismaClient } from '@prisma/client';
import { Seeder } from './seeders/seeder.seeder';
import { UserSeeder } from './seeders/user.seeder';

export class Seed {
  private seeders: Seeder[] = [new UserSeeder()];
  constructor(private prisma: PrismaClient) {}

  async seed(): Promise<void> {
    this.seeders.map((seeder) => {
      Array.from({ length: seeder.getCount() }).forEach(() => {
        seeder.seed(this.prisma);
      });
    });
  }
}

const prisma = new PrismaClient();
new Seed(prisma)
  .seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
