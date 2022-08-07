/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Prisma } from '@prisma/client';
import { Seeder as ISeeder } from '../interface/seeder.interface';

export class Seeder implements ISeeder {
  private count = 50;

  seed(
    prisma: PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation
    >,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setCount(count: number): void {
    this.count = count;
  }

  getCount(): number {
    return this.count;
  }
}
