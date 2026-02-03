import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const email = 'admin@jobboard.com'
    const password = 'securepassword123'

    // 1. Hash the password
    const password_hash = await bcrypt.hash(password, 10)

    // 2. Upsert (Update if exists, Insert if new) to avoid duplicates
    const admin = await prisma.admin.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password_hash,
        },
    })

    console.log(`Admin created: ${admin.email}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })