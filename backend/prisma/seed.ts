import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const user = async () => ({
  name: faker.name.findName(),
  email: faker.unique(faker.internet.email).toLowerCase(),
  password: await bcrypt.hash('password', 10),
});

const project = async (data: { userId: number }) => ({
  name: faker.lorem.words(faker.datatype.number({ min: 3, max: 10 })),
  description: faker.datatype.boolean()
    ? faker.lorem.words(faker.datatype.number({ min: 3, max: 10 }))
    : null,
  ...data,
});

const generateFakeData = async <T>(func: () => Promise<T>, count = 50) => {
  return await Promise.all(Array(count).fill(null).map(func));
};

async function main() {
  const usersData = await generateFakeData(user);
  await prisma.user.createMany({ data: usersData });
  const users = await prisma.user.findMany();
  const projectsData = await generateFakeData(() =>
    project({ userId: faker.helpers.arrayElement(users).id }),
  );
  await prisma.project.createMany({ data: projectsData });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
