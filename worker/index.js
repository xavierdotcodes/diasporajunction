import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { fileLogger, serializeError } from '../src/lib/utils/logger.js';

const log = fileLogger('worker/index.js');

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function run() {
	log.info({ phase: 'worker_run_started' });

	const upcoming = await prisma.installment.findMany({
		where: {
			dueDate: { lte: new Date() },
			paid: false
		}
	});

	log.info({
		phase: 'worker_installments_loaded',
		count: upcoming.length
	});

	for (const installment of upcoming) {
		log.info({
			phase: 'worker_installment_charging',
			bookingId: installment.bookingId,
			installmentId: installment.id
		});
		// charge logic here
	}
}

run().then(() => {
	log.info({ phase: 'worker_run_completed' });
	process.exit(0);
}).catch((error) => {
	log.error({
		phase: 'worker_run_failed',
		error: serializeError(error)
	});
	process.exit(1);
});
