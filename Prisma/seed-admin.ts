import 'dotenv/config';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type UserProps = {
  email: string;
  name: string;
  pwd: string;
}

async function main() {
  console.log('🌱 Creating users...');
  const users: UserProps[] = [{
    email :'admin@grondin.com',
    name : 'Administrateur', 
    pwd : 'admin123',
  }];

  for(const u of users){
    await createUser(u);
    console.log(`✅ User <${u.name}> created`);
  }
}

async function createUser({email, name, pwd}: UserProps){
  const existingAdmin = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingAdmin) {
    console.log(`✅ User <${email}> already exists`);
    return;
  }

  // Créer l'admin
  const hashedPassword = await bcrypt.hash(pwd, 10);

  const admin = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: name,
    },
  });
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