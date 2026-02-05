import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function ensureConnection() {
    try {
        await prisma.$connect();
    } catch (e) {
        console.log("⚠️ Database sleeping? Retrying connection...");
        // Wait 2 seconds and try once more
        await new Promise(res => setTimeout(res, 2000));
        await prisma.$connect();
    }
}