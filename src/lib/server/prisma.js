
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import 'dotenv/config';
import { scopedLogger } from '$lib/utils/logger';

const log = scopedLogger('prisma');

const isProd = process.env.NODE_ENV === 'production';

let prisma;

if (isProd) {
    // 🚀 Production → Accelerate
    prisma = new PrismaClient({
        log: ['warn', 'error'],
        accelerateUrl: process.env.DATABASE_URL,
    }).$extends(withAccelerate());

} else {
    // 🛠 Local → direct Postgres via adapter
    const adapter = new PrismaPg({
        connectionString: process.env.DIRECT_DATABASE_URL,
    });

    prisma = new PrismaClient({
        log: ['warn', 'error'],
        adapter,
    });
}

if (prisma) log.info('Prisma client generated');

export default prisma;
