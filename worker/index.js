import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { fileLogger } from '../src/lib/utils/logger.js';

fileLogger('worker/index.js');

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function run() {
	const upcoming = await prisma.installment.findMany({
		where: {
			dueDate: { lte: new Date() },
			paid: false
		}
	});

	for (const installment of upcoming) {
		console.log(`Charging installment for booking ${installment.bookingId}`);
		// charge logic here
	}
}

run().then(() => {
	console.log('Worker complete');
	process.exit(0);
});
