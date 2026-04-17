import prisma from '$lib/server/prisma';
import { enqueueLeadNurtureSequence } from '$lib/server/queues/email.queue';
import { fileLogger, scopedLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/leads.js');

const log = scopedLogger('leads');

function normalizeEmail(email) {
	return email.trim().toLowerCase();
}

function cleanOptionalString(value) {
	if (typeof value !== 'string') return null;

	const cleaned = value.trim();
	return cleaned.length > 0 ? cleaned : null;
}

function buildLeadPayload(input) {
	return {
		email: normalizeEmail(input.email),
		firstName: cleanOptionalString(input.firstName),
		source: cleanOptionalString(input.source),
		leadMagnet: cleanOptionalString(input.leadMagnet),
		entryPage: cleanOptionalString(input.entryPage),
		referrer: cleanOptionalString(input.referrer),
		utmSource: cleanOptionalString(input.utmSource),
		utmMedium: cleanOptionalString(input.utmMedium),
		utmCampaign: cleanOptionalString(input.utmCampaign),
		utmContent: cleanOptionalString(input.utmContent)
	};
}

function validateLeadInput(input) {
	if (!input.email) {
		return 'Email is required';
	}

	const email = normalizeEmail(input.email);
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailPattern.test(email)) {
		return 'Please enter a valid email address';
	}

	return null;
}

function buildLeadUpdateData(existingLead, payload) {
	const nextData = {};

	for (const key of [
		'firstName',
		'source',
		'leadMagnet',
		'entryPage',
		'referrer',
		'utmSource',
		'utmMedium',
		'utmCampaign',
		'utmContent'
	]) {
		if (payload[key] && !existingLead[key]) {
			nextData[key] = payload[key];
		}
	}

	if (existingLead.status === 'UNSUBSCRIBED') {
		nextData.status = 'ACTIVE';
		nextData.unsubscribedAt = null;
		nextData.subscribedAt = new Date();
	}

	if (!existingLead.subscribedAt) {
		nextData.subscribedAt = new Date();
	}

	return nextData;
}

export async function captureLeadSignup(input) {
	const validationError = validateLeadInput(input);
	if (validationError) {
		return { ok: false, error: validationError, status: 400 };
	}

	const payload = buildLeadPayload(input);
	const existingLead = await prisma.lead.findUnique({
		where: { email: payload.email }
	});

	const eventType = existingLead ? 'lead_signup_updated' : 'lead_signup_created';
	let lead;

	if (existingLead) {
		const updateData = buildLeadUpdateData(existingLead, payload);

		lead = await prisma.lead.update({
			where: { id: existingLead.id },
			data: updateData
		});
	} else {
		lead = await prisma.lead.create({
			data: {
				...payload,
				status: 'ACTIVE',
				subscribedAt: new Date()
			}
		});
	}

	await prisma.leadEvent.create({
		data: {
			leadId: lead.id,
			type: eventType,
			page: payload.entryPage,
			metadata: {
				source: payload.source,
				leadMagnet: payload.leadMagnet,
				referrer: payload.referrer,
				utmSource: payload.utmSource,
				utmMedium: payload.utmMedium,
				utmCampaign: payload.utmCampaign,
				utmContent: payload.utmContent
			}
		}
	});

	await enqueueLeadNurtureSequence({
		leadId: lead.id,
		email: lead.email,
		firstName: lead.firstName,
		leadMagnet: lead.leadMagnet
	});

	log.info({
		phase: 'lead_captured',
		leadId: lead.id,
		email: lead.email,
		eventType
	});

	return {
		ok: true,
		lead,
		created: !existingLead
	};
}

export async function unsubscribeLead(leadId) {
	if (!leadId) {
		return { ok: false, error: 'Missing lead id' };
	}

	const existingLead = await prisma.lead.findUnique({
		where: { id: leadId }
	});

	if (!existingLead) {
		return { ok: false, error: 'Lead not found' };
	}

	const lead = await prisma.lead.update({
		where: { id: leadId },
		data: {
			status: 'UNSUBSCRIBED',
			unsubscribedAt: new Date()
		}
	});

	await prisma.leadEvent.create({
		data: {
			leadId: lead.id,
			type: 'lead_unsubscribed',
			page: '/unsubscribe'
		}
	});

	return { ok: true, lead };
}
