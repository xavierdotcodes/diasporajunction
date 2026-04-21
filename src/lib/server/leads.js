import prisma from '$lib/server/prisma';
import { inngest } from '$lib/server/inngest';
import { fileLogger, scopedLogger, serializeError } from '$lib/utils/logger';

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
	log.info({
		op: 'capture_lead_signup',
		phase: 'start',
		email: input?.email ? normalizeEmail(input.email) : undefined,
		source: input?.source,
		entryPage: input?.entryPage
	});

	const validationError = validateLeadInput(input);
	if (validationError) {
		log.warn({
			op: 'capture_lead_signup',
			phase: 'guard',
			reason: 'validation_failed',
			email: input?.email ? normalizeEmail(input.email) : undefined,
			error: validationError
		});
		return { ok: false, error: validationError, status: 400 };
	}

	const payload = buildLeadPayload(input);
	log.debug({
		op: 'capture_lead_signup',
		phase: 'query',
		query: 'lead.findUnique',
		email: payload.email
	});
	const existingLead = await prisma.lead.findUnique({
		where: { email: payload.email }
	});

	const eventType = existingLead ? 'lead_signup_updated' : 'lead_signup_created';
	let lead;

	if (existingLead) {
		const updateData = buildLeadUpdateData(existingLead, payload);
		log.debug({
			op: 'capture_lead_signup',
			phase: 'mutation',
			mutation: 'lead.update',
			leadId: existingLead.id,
			fields: Object.keys(updateData)
		});

		lead = await prisma.lead.update({
			where: { id: existingLead.id },
			data: updateData
		});
	} else {
		log.debug({
			op: 'capture_lead_signup',
			phase: 'mutation',
			mutation: 'lead.create',
			email: payload.email
		});
		lead = await prisma.lead.create({
			data: {
				...payload,
				status: 'ACTIVE',
				subscribedAt: new Date()
			}
		});
	}

	log.debug({
		op: 'capture_lead_signup',
		phase: 'mutation',
		mutation: 'leadEvent.create',
		leadId: lead.id,
		eventType
	});
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

	const leadCapturedAt = lead.subscribedAt || lead.createdAt || new Date();
	const eventName = 'app/lead.captured';
	const eventId = `app-lead-captured:${lead.id}:${leadCapturedAt.toISOString()}`;
	log.info({
		op: 'capture_lead_signup',
		phase: 'event_send',
		eventName,
		eventId,
		leadId: lead.id,
		email: lead.email
	});

	let eventIds;

	try {
		({ ids: eventIds } = await inngest.send({
			id: eventId,
			name: eventName,
			data: {
				leadId: lead.id,
				email: lead.email,
				firstName: lead.firstName,
				leadMagnet: lead.leadMagnet
			}
		}));
	} catch (error) {
		log.error({
			op: 'capture_lead_signup',
			phase: 'event_send_error',
			eventName,
			eventId,
			leadId: lead.id,
			error: serializeError(error)
		});
		throw error;
	}

	log.info({
		op: 'capture_lead_signup',
		phase: 'success',
		leadId: lead.id,
		email: lead.email,
		eventType,
		eventName,
		eventId,
		eventIds
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
