export function buildSearchFilters(params = {}) {
	const query = String(params.query ?? '').trim();
	const location = String(params.location ?? '').trim();
	return {
		query: query || undefined,
		category: params.category || undefined,
		location: location || undefined,
		verifiedOnly: Boolean(params.verifiedOnly),
		targetAudience: params.targetAudience || undefined
	};
}

export function listingMatchesFilters(listing, filters = {}) {
	if (!listing?.isActive) return false;
	if (filters.category && listing.category !== filters.category) return false;
	if (filters.verifiedOnly && listing.verificationStatus !== 'VERIFIED') return false;
	if (
		filters.targetAudience &&
		listing.targetAudience !== filters.targetAudience &&
		listing.targetAudience !== 'BOTH'
	) {
		return false;
	}
	if (filters.location) {
		const haystack = `${listing.city ?? ''} ${listing.region ?? ''} ${listing.country ?? ''} ${listing.serviceArea ?? ''}`.toLowerCase();
		if (!haystack.includes(filters.location.toLowerCase())) return false;
	}
	if (filters.query) {
		const haystack = `${listing.businessName ?? ''} ${listing.shortDescription ?? ''} ${listing.description ?? ''} ${listing.category ?? ''} ${listing.customCategory ?? ''}`.toLowerCase();
		if (!haystack.includes(filters.query.toLowerCase())) return false;
	}
	return true;
}

export function sortFeaturedFirst(a, b) {
	if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
	return (b.createdAt ?? 0) - (a.createdAt ?? 0);
}
