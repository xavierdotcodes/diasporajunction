const allowedTransitions = {
	PENDING: ['INITIATED', 'FAILED', 'ABANDONED'],
	INITIATED: ['SUCCESS', 'FAILED', 'ABANDONED'],
	SUCCESS: ['REFUNDED'],
	FAILED: ['PENDING', 'INITIATED'],
	ABANDONED: ['PENDING', 'INITIATED'],
	REFUNDED: []
};

export function assertPaymentTransition(currentStatus, nextStatus) {
	if (currentStatus === nextStatus) return true;
	const allowed = allowedTransitions[currentStatus] ?? [];
	if (!allowed.includes(nextStatus)) {
		throw new Error(`Cannot move payment from ${currentStatus} to ${nextStatus}.`);
	}
	return true;
}

export function mapPaymentToApplicationStatus(paymentStatus) {
	if (paymentStatus === 'SUCCESS') return 'PAID';
	if (paymentStatus === 'INITIATED') return 'PAYMENT_INITIATED';
	if (paymentStatus === 'FAILED') return 'AWAITING_PAYMENT';
	if (paymentStatus === 'ABANDONED') return 'AWAITING_PAYMENT';
	return undefined;
}
