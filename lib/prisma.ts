import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

// 1. Validation to prevent the "at base" error
if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
    // 2. Add a connection timeout to the pool itself
    const pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 10000, // 10 seconds
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function ensureConnection() {
    try {
        await prisma.$connect();
    } catch (e) {
        console.error("❌ Connection failed, retrying...", e);
        await new Promise(res => setTimeout(res, 2000));
        await prisma.$connect();
    }
}