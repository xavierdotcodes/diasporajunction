// scripts/seed-admin.js
import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/server/prisma.js';

const run = async () => {
	const passwordHash = await bcrypt.hash('D!@sp0r@junx!0n', 10);

	await prisma.user.create({
		data: {
			email: 'xcc2b@virginia.edu',
			passwordHash,
			role: 'ADMIN'
		}
	});

	console.log('✅ Admin created: xcc2b@virginia.edu / D!@sp0r@junx!0n');
};

run().catch(console.error);
