import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';
import 'dotenv/config';
import { scopedLogger } from '$lib/utils/logger';

const log = scopedLogger('prisma');

const globalForPrisma = globalThis;

function createPrisma() {
    const databaseUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DIRECT_DATABASE_URL;

    const isAccelerate =
        typeof databaseUrl === 'string' &&
        (databaseUrl.startsWith('prisma://') ||
            databaseUrl.startsWith('prisma+postgres://'));

    if (isAccelerate) {
        log.info('Initializing Prisma with Accelerate');
        return new PrismaClient({
            log: ['warn', 'error'],
            accelerateUrl: databaseUrl
        }).$extends(withAccelerate());
    }

    const connectionString = directUrl || databaseUrl;

    if (!connectionString) {
        throw new Error(
            'Missing database connection. Set DIRECT_DATABASE_URL for direct Postgres or DATABASE_URL for Accelerate/direct usage.'
        );
    }

    log.info('Initializing Prisma with PrismaPg adapter');
    const adapter = new PrismaPg({ connectionString });

    return new PrismaClient({
        log: ['warn', 'error'],
        adapter
    });
}

const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
