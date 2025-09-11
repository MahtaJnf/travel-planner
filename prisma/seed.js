const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash(process.env.DEMO_PASSWORD || 'demo-demo');
  await prisma.user.upsert({
    where: { id: 'demo-user' },
    update: { email: 'demo@local', hashed_password: hash },
    create: { id: 'demo-user', email: 'demo@local', hashed_password: hash },
  });
  await prisma.$executeRawUnsafe(`
    UPDATE "favorites" SET "user_id" = 'demo-user'
    WHERE "user_id" IS NULL OR "user_id" = 'demo-user'
  `);
  console.log('Seeded demo user: demo@local / demo-demo');
}

main().finally(() => prisma.$disconnect());
