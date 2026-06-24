export function summarizeInteractions(interactions = []) {
	const summary = {
		views: 0,
		searchResultShown: 0,
		profileViews: 0,
		whatsappClicks: 0,
		phoneClicks: 0,
		emailClicks: 0,
		websiteClicks: 0,
		quoteRequests: 0,
		saves: 0,
		shares: 0
	};

	for (const interaction of interactions) {
		if (interaction.type === 'SEARCH_RESULT_SHOWN') summary.searchResultShown += 1;
		if (interaction.type === 'LISTING_PROFILE_VIEWED') summary.profileViews += 1;
		if (interaction.type === 'VIEW') summary.views += 1;
		if (interaction.type === 'WHATSAPP_CLICK') summary.whatsappClicks += 1;
		if (interaction.type === 'PHONE_CLICK') summary.phoneClicks += 1;
		if (interaction.type === 'EMAIL_CLICK') summary.emailClicks += 1;
		if (interaction.type === 'WEBSITE_CLICK') summary.websiteClicks += 1;
		if (interaction.type === 'QUOTE_REQUEST') summary.quoteRequests += 1;
		if (interaction.type === 'SAVE') summary.saves += 1;
		if (interaction.type === 'SHARE') summary.shares += 1;
	}

	return summary;
}
