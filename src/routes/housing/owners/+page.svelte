<script>
	import Button from '$lib/components/ui/Button.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('housing.owner.dashboard.page');

	let { data } = $props();

	function formatStatus(status) {
		return status.replaceAll('_', ' ');
	}

	const statusCounts = $derived(
		data.listings.reduce(
			(counts, listing) => {
				counts[listing.status] = (counts[listing.status] || 0) + 1;
				return counts;
			},
			{
				DRAFT: 0,
				PAYMENT_PENDING: 0,
				PENDING_REVIEW: 0,
				PUBLISHED: 0,
				ARCHIVED: 0
			}
		)
	);

	const ownerSteps = $derived([
		'Start a draft and add the property basics.',
		'Upload 5 to 10 clear photos and preview the listing on mobile.',
		`Pay the $${data.ownerListingFeeUsd} submission fee when the listing is ready.`,
		'Wait for review, then track whether the listing is pending or published.'
	]);

	const statusGuide = [
		{
			label: 'Draft',
			copy: 'Still being built. You can keep editing before you submit.'
		},
		{
			label: 'Payment pending',
			copy: 'You started the submit step, but payment has not been confirmed yet.'
		},
		{
			label: 'Pending review',
			copy: 'Payment is confirmed and the listing is waiting for review.'
		},
		{
			label: 'Published',
			copy: 'The listing is live for diaspora browsers.'
		}
	];
</script>

<section class="owner-dashboard">
	<div class="shell">
		<header class="page-header">
			<div>
				<p class="eyebrow">Owner Portal</p>
				<h1>Your Ghana housing listings</h1>
				<p class="copy">
					This portal is for landlords, agents, apartment owners, and developers who want to present
					a Ghana property more clearly to diaspora renters, returnees, and families. The current
					listing fee is ${data.ownerListingFeeUsd}.
				</p>
			</div>

			<div class="header-actions">
				<Button href="/housing/listings" variant="outline" size="lg">View Public Listings</Button>
				<form method="POST" action="?/createDraft">
					<Button type="submit" variant="brand" size="lg">Start New Draft</Button>
				</form>
			</div>
		</header>

		<section class="overview-grid">
			<article class="overview-card emphasis">
				<p class="card-kicker">How Owner Submission Works</p>
				<h2>One lean flow from draft to review.</h2>
				<ol class="step-list">
					{#each ownerSteps as step}
						<li>{step}</li>
					{/each}
				</ol>
			</article>

			<article class="overview-card">
				<p class="card-kicker">Your Listing Status</p>
				<div class="metric-grid">
					<div>
						<strong>{statusCounts.DRAFT}</strong>
						<span>Drafts</span>
					</div>
					<div>
						<strong>{statusCounts.PENDING_REVIEW}</strong>
						<span>Pending Review</span>
					</div>
					<div>
						<strong>{statusCounts.PUBLISHED}</strong>
						<span>Published</span>
					</div>
					<div>
						<strong>{data.listings.length}</strong>
						<span>Total Listings</span>
					</div>
				</div>
			</article>
		</section>

		<section class="guide-card">
			<div>
				<p class="card-kicker">Before You Submit</p>
				<h2>Make the listing easy for a diaspora renter to understand quickly.</h2>
			</div>
			<div class="guide-grid">
				{#each statusGuide as item}
					<article>
						<h3>{item.label}</h3>
						<p>{item.copy}</p>
					</article>
				{/each}
			</div>
		</section>

		{#if data.listings.length === 0}
			<div class="empty-state">
				<div>
					<p class="card-kicker">No Listings Yet</p>
					<h2>Start with one clean, serious listing.</h2>
					<p>
						Add the basics first: title, area, price, bedrooms, photos, and short diaspora-facing
						notes. You can save the draft before you pay.
					</p>
				</div>
				<form method="POST" action="?/createDraft">
					<Button type="submit" variant="brand" size="lg">Create Your First Draft</Button>
				</form>
			</div>
		{:else}
			<div class="listings-header">
				<div>
					<p class="card-kicker">Your Listings</p>
					<h2>Open a listing to keep editing, pay, or check its status.</h2>
				</div>
			</div>

			<div class="listing-grid">
				{#each data.listings as listing}
					<article class="listing-card">
						<img src={listing.images?.[0]?.url || '/images/keys.jpg'} alt={listing.title} />
						<div class="listing-body">
							<div class="card-top">
								<div>
									<h2>{listing.title}</h2>
									<p>{listing.location}{listing.neighborhood ? `, ${listing.neighborhood}` : ''}</p>
								</div>
								<span class="status-chip">{formatStatus(listing.status)}</span>
							</div>

							<p class="summary">{listing.summary}</p>

							<div class="facts">
								<span>{listing._count.inquiries} inquiries</span>
								<span>{listing.images.length} photos</span>
								{#if listing.paidAt}
									<span>Paid</span>
								{/if}
							</div>

							<Button href={`/housing/owners/listings/${listing.id}`} variant="outline" size="lg">
								Open Draft
							</Button>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.owner-dashboard {
		padding: 2rem 0 4rem;
		background:
			radial-gradient(circle at top left, rgba(3, 140, 37, 0.16), transparent 26rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.25rem;
	}

	.page-header,
	.listing-grid,
	.overview-grid,
	.metric-grid,
	.guide-grid {
		display: grid;
		gap: 1rem;
	}

	.eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(3, 140, 37, 0.82);
	}

	h1,
	h2,
	h3,
	p,
	ol {
		margin: 0;
	}

	h1,
	h2,
	h3 {
		letter-spacing: -0.04em;
	}

	.copy,
	.summary,
	.empty-state p,
	.listing-body p,
	.step-list,
	.guide-card article p {
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.72);
	}

	.empty-state,
	.listing-card,
	.overview-card,
	.guide-card {
		padding: 1.35rem;
		border-radius: 2rem;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 20px 48px rgba(17, 17, 17, 0.1);
	}

	.overview-card.emphasis {
		background:
			radial-gradient(circle at top right, rgba(3, 140, 37, 0.12), transparent 18rem),
			rgba(255, 255, 255, 0.94);
	}

	.listing-card {
		display: grid;
		gap: 1rem;
	}

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}

	.card-kicker {
		margin: 0 0 0.65rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(3, 140, 37, 0.82);
	}

	.step-list {
		padding-left: 1.15rem;
		display: grid;
		gap: 0.65rem;
		margin-top: 1rem;
	}

	.metric-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin-top: 1rem;
	}

	.metric-grid div,
	.guide-grid article {
		padding: 1rem;
		border-radius: 1.4rem;
		background: #faf5e5;
	}

	.metric-grid strong {
		display: block;
		font-size: 2rem;
		line-height: 1;
		letter-spacing: -0.06em;
	}

	.metric-grid span {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(17, 17, 17, 0.58);
	}

	.guide-card {
		margin-top: 1rem;
	}

	.guide-grid {
		margin-top: 1rem;
	}

	.listings-header {
		margin: 1.5rem 0 1rem;
	}

	.listing-card img {
		width: 100%;
		height: 14rem;
		object-fit: cover;
		border-radius: 1.5rem;
	}

	.listing-body,
	.card-top,
	.facts {
		display: grid;
		gap: 0.8rem;
	}

	.status-chip,
	.facts span {
		display: inline-flex;
		align-items: center;
		min-height: 2rem;
		padding: 0 0.85rem;
		border-radius: 999px;
		background: #faf5e5;
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
	}

	@media (min-width: 768px) {
		.page-header {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: end;
		}

		.overview-grid {
			grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
		}

		.listing-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.card-top {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: start;
		}

		.guide-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
