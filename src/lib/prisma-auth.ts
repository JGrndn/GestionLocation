import { PrismaClient } from '@/generated/prisma-auth/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrismaAuth = globalThis as unknown as {
  prismaAuth: PrismaClient | undefined;
};

const authAdapter = new PrismaPg({ connectionString: process.env.AUTH_DATABASE_URL });

export const prismaAuth =
  globalForPrismaAuth.prismaAuth ??
  new PrismaClient({
    adapter: authAdapter,
    log: process.env.NEXT_PUBLIC_APP_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
  globalForPrismaAuth.prismaAuth = prismaAuth;
}
