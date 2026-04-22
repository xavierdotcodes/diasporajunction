<script>
	import Button from '$lib/components/ui/Button.svelte';

	let {
		listing,
		locked = false,
		href = null
	} = $props();

	const imageUrl = $derived(listing.images?.[0]?.url || '/images/keys.jpg');
	const detailHref = $derived(href || `/housing/listings/${listing.slug}`);
	const priceLabel = $derived(
		listing.priceAmount
			? `${listing.currency} ${listing.priceAmount.toLocaleString()}${listing.pricePeriod ? ` / ${listing.pricePeriod}` : ''}`
			: 'Pricing shared after inquiry'
	);
</script>

<article class="listing-card">
	<img class="listing-image" src={imageUrl} alt={listing.title} />

	<div class="listing-body">
		<div class="listing-meta">
			<span>{listing.listingType.replace('_', ' ')}</span>
			<span>{listing.stayType.replace('_', ' ')}</span>
			{#if listing.familyFriendly}
				<span>Family-friendly</span>
			{/if}
		</div>

		<h3>{listing.title}</h3>
		<p class="location">{listing.location}{listing.neighborhood ? `, ${listing.neighborhood}` : ''}</p>
		<p class="summary">{listing.summary}</p>

		<div class="facts">
			<span>{priceLabel}</span>
			<span>{listing.bedrooms ? `${listing.bedrooms} bd` : 'Flexible layout'}</span>
			<span>{listing.furnished ? 'Furnished' : 'Unfurnished / mixed'}</span>
		</div>

		<div class="actions">
			{#if locked}
				<Button href="/housing#unlock" variant="brand" size="sm">Unlock Listings</Button>
			{:else}
				<Button href={detailHref} variant="brand" size="sm">View Details</Button>
			{/if}
		</div>
	</div>
</article>

<style>
	.listing-card {
		display: grid;
		overflow: hidden;
		border-radius: 1.9rem;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 20px 48px rgba(17, 17, 17, 0.1);
	}

	.listing-image {
		width: 100%;
		height: 14rem;
		object-fit: cover;
	}

	.listing-body {
		display: grid;
		gap: 0.9rem;
		padding: 1.2rem;
	}

	.listing-meta,
	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.listing-meta span,
	.facts span {
		display: inline-flex;
		align-items: center;
		min-height: 1.9rem;
		padding: 0 0.75rem;
		border-radius: 999px;
		background: #faf5e5;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h3 {
		margin: 0;
		font-size: 1.45rem;
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.location,
	.summary {
		margin: 0;
	}

	.location {
		font-size: 0.95rem;
		font-weight: 700;
		color: rgba(17, 17, 17, 0.72);
	}

	.summary {
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.78);
	}

	.actions {
		margin-top: 0.35rem;
	}
</style>
