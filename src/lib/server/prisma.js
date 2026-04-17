// src/lib/server/prisma.js
import { building } from '$app/environment';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';
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

function getClient() {
    if (building) {
        return null;
    }

    if (!globalForPrisma.__prisma) {
        globalForPrisma.__prisma = createPrisma();
    }

    return globalForPrisma.__prisma;
}

const prisma = new Proxy(
    {},
    {
        get(_target, prop) {
            const client = getClient();

            if (!client) {
                // During SvelteKit build analysis, return a harmless noop function
                // so mere imports don't explode.
                return () => {
                    throw new Error(`Prisma cannot be used during build analysis. Tried to access prisma.${String(prop)}`);
                };
            }

            const value = client[prop];

            return typeof value === 'function' ? value.bind(client) : value;
        }
    }
);

export default prisma;
