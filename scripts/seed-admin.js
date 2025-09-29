// scripts/seed-admin.js
import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/server/prisma.js';

const run = async () => {
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

	console.log('✅ Admin created:', adminUser.email, '/ D!@sp0r@junx!0n');
};

run().catch((err) => {
	console.error('❌ Failed to create admin:', err);
});
