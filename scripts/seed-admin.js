// scripts/seed-admin.js
import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/server/prisma.js';
import { fileLogger, serializeError } from '../src/lib/utils/logger.js';

const log = fileLogger('scripts/seed-admin.js');

const run = async () => {
	log.info({ phase: 'seed_admin_started' });

	// hash the password
	const hashedPassword = await bcrypt.hash('D!@sp0r@junx!0n', 10);

	// create the user
	const adminUser = await prisma.user.create({
		data: {
			email: 'xcc2b@virginia.edu',
			password: hashedPassword,
			name: 'Admin',
			subscribed: false,
			roles: {
				create: [
					{
						role: 'ADMIN'
					}
				]
			}
		},
		include: { roles: true }
	});

	log.info({
		phase: 'seed_admin_completed',
		email: adminUser.email,
		roleCount: adminUser.roles?.length ?? 0
	});
};

run().catch((error) => {
	log.error({
		phase: 'seed_admin_failed',
		error: serializeError(error)
	});
});
