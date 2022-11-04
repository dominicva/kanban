import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const seedProjects = [
  {
    name: 'SpaceX',
    description:
      'SpaceX designs, manufactures and launches advanced rockets and spacecraft.',
  },
  {
    name: 'Tesla',
    description:
      'Tesla designs and manufactures electric vehicles and energy storage products.',
  },
  {
    name: 'Neuralink',
    description:
      'Neuralink is developing ultra-high bandwidth brain-machine interfaces to connect humans and computers.',
  },
];

async function main() {
  const seedUser = await prisma.user.create({
    data: {
      username: 'elon',
      passwordHash: bcrypt.hashSync('musk', 10),
    },
  });

  console.log('New user created:', seedUser);

  for (const { name, description } of seedProjects) {
    const project = await prisma.project.upsert({
      where: { name_userId: { name, userId: seedUser.id } },
      create: { name, description, userId: seedUser.id },
      update: { name, description, userId: seedUser.id },
    });

    console.log('Newly created project:', project);
  }
}

main()
  .then(async () => {
    console.log('Database seeded successfully');
    await prisma.$disconnect;
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
