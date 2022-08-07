import { PrismaClient } from '@prisma/client';

export interface Seeder {
  seed(prisma: PrismaClient): Promise<void>;

  setCount(count: number): void;

  getCount(): number;
}
