const DESTINATION = '/start-here';

export const redirectSources = {
	li: { utmSource: 'li', utmMedium: 'social' },
	x: { utmSource: 'x', utmMedium: 'social' },
	ig: { utmSource: 'ig', utmMedium: 'social' },
	yt: { utmSource: 'yt', utmMedium: 'social' },
	th: { utmSource: 'th', utmMedium: 'social' },
	tt: { utmSource: 'tt', utmMedium: 'social' },
	pi: { utmSource: 'pi', utmMedium: 'social' },
	rd: { utmSource: 'rd', utmMedium: 'social' },
	em: { utmSource: 'em', utmMedium: 'email' }
};

const allowedCampaignPattern = /^[a-z0-9-]+$/i;

export function buildTrackedRedirect(origin, slug, campaign = 'start') {
	const source = redirectSources[slug];

	if (!source) return null;
	if (!allowedCampaignPattern.test(campaign)) return null;

	const url = new URL(DESTINATION, origin);
	url.searchParams.set('utm_source', source.utmSource);
	url.searchParams.set('utm_medium', source.utmMedium);
	url.searchParams.set('utm_campaign', campaign);

	return url;
}
