<script>
	import HousingListingCard from '$lib/components/housing/HousingListingCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('housing.landing.page');

	let { data } = $props();

	const trustPoints = [
		'Listings are framed for diaspora renters, returnees, and families thinking through relocation.',
		'DiasporaJunxion is not pretending to be a giant marketplace. The goal is cleaner signal and more useful presentation.',
		'Property owners can submit listings through a simple paid portal, and listings can be reviewed before publication.'
	];

	const audienceCards = $derived([
		{
			title: 'For diaspora browsers',
			copy: 'Browse published listings, compare neighborhoods, and send an inquiry when a property looks like a serious fit for your move.',
			href: '/housing/listings',
			cta: 'Browse Listings'
		},
		{
			title: 'For property owners',
			copy: 'Create a draft, upload photos, preview the page, and pay a small one-time fee when you are ready to submit for review.',
			href: data.housingViewer.signedIn ? '/housing/owners' : '/housing/list-your-property',
			cta: data.housingViewer.signedIn ? 'Open Owner Portal' : 'See Owner Flow'
		}
	]);
</script>

<div class="housing-page">
	<Hero
		variant="page"
		subtitle="Housing"
		description="DiasporaJunxion helps diaspora people explore cleaner, more understandable housing options in Ghana without turning this into listing noise."
		imageSrc="/images/keys.jpg"
		imageAlt="Keys resting on a table"
	>
		{#snippet title()}
			<h1>Explore Ghana housing with more context, less classified-board chaos.</h1>
		{/snippet}

		{#snippet cta()}
			<div class="hero-actions">
				<Button href="/housing/listings" variant="brand" size="lg">Browse Listings</Button>
				<Button href="/housing/list-your-property" variant="outline" size="lg">List Your Property</Button>
			</div>
		{/snippet}

		{#snippet aside()}
			<div class="hero-panel">
				<p class="panel-kicker">What This Is</p>
				<ul>
					{#each trustPoints as point}
						<li>{point}</li>
					{/each}
				</ul>
			</div>
		{/snippet}
	</Hero>

	<section class="section">
		<div class="shell">
			<SectionHeader
				eyebrow="Two Paths"
				title="One housing layer, with a path for browsers and a path for property owners."
				description="Diaspora renters and returnees can browse publicly. Property owners in Ghana can create a listing draft, upload images, and pay a small submission fee before review."
			/>

			<div class="steps">
				<article>
					<h3>For diaspora browsers</h3>
					<p>Browse published listings, compare neighborhoods and pricing context, and send inquiries when something looks like a real fit.</p>
				</article>
				<article>
					<h3>For property owners</h3>
					<p>Create a draft, upload your best photos, preview the listing, and submit it through a lean paid portal.</p>
				</article>
				<article>
					<h3>For DiasporaJunxion</h3>
					<p>The submission fee keeps the workflow practical while allowing listings to be moderated before they go live.</p>
				</article>
			</div>

			<div class="audience-grid">
				{#each audienceCards as card}
					<article class="audience-card">
						<h3>{card.title}</h3>
						<p>{card.copy}</p>
						<Button href={card.href} variant="outline" size="lg">{card.cta}</Button>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="section section-preview">
		<div class="shell">
			<SectionHeader
				eyebrow="Preview"
				title="Published listings, shown in a more diaspora-facing way."
				description="The housing section is meant to make the early housing search feel more understandable for returnees, families, and longer-stay decision makers."
			/>

			{#if data.previewListings.length > 0}
				<div class="listing-grid">
					{#each data.previewListings as listing}
						<HousingListingCard {listing} />
					{/each}
				</div>
			{:else}
				<div class="preview-empty">
					<h3>Published listings will appear here as they go live.</h3>
					<p>
						You can still browse the housing section or use the owner path now. This preview area stays
						light on purpose.
					</p>
					<div class="preview-actions">
						<Button href="/housing/listings" variant="brand" size="lg">Browse Listings</Button>
						<Button href="/housing/list-your-property" variant="outline" size="lg">List Your Property</Button>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<section class="section section-owner">
		<div class="shell owner-grid">
			<div>
				<p class="eyebrow">Owner Submission</p>
				<h2>Property owners can submit a listing for ${data.ownerListingFeeUsd}.</h2>
				<p class="copy">
					The owner side is intentionally simple: sign in, build the draft, upload photos, pay the fee,
					and submit the listing for review. That keeps this lean enough to use now.
				</p>
			</div>

			<div class="owner-card">
				<p>Who this is for:</p>
				<ul>
					<li>Landlords with diaspora-friendly rentals</li>
					<li>Agents managing a clean shortlist of Ghana properties</li>
					<li>Developers who want clearer diaspora-facing positioning</li>
				</ul>
				<Button href="/housing/list-your-property" variant="brand" size="lg">Open Owner Path</Button>
			</div>
		</div>
	</section>
</div>

<style>
	.housing-page {
		background: #f8f2df;
		color: #111111;
	}

	.shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.section {
		padding: clamp(4.6rem, 8vw, 6.4rem) 0;
	}

	.section-preview {
		background:
			radial-gradient(circle at top right, rgba(217, 4, 43, 0.08), transparent 24rem),
			linear-gradient(180deg, #fff8ef 0%, #f4ead1 100%);
	}

	.section-owner {
		background:
			radial-gradient(circle at top left, rgba(3, 140, 37, 0.12), transparent 24rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-top: 1.2rem;
	}

	.hero-panel,
	.steps article,
	.owner-card {
		padding: 1.3rem;
		border-radius: 1.8rem;
		background: rgba(255, 255, 255, 0.82);
		box-shadow: 0 18px 44px rgba(17, 17, 17, 0.08);
	}

	.owner-card {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.panel-kicker,
	.eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.panel-kicker {
		color: rgba(17, 17, 17, 0.62);
	}

	.hero-panel ul,
	.owner-card ul {
		margin: 1rem 0 0;
		padding-left: 1rem;
		display: grid;
		gap: 0.7rem;
		line-height: 1.7;
	}

	.steps,
	.audience-grid,
	.listing-grid,
	.owner-grid,
	.preview-actions {
		display: grid;
		gap: 1rem;
		margin-top: 2rem;
	}

	.audience-card,
	h2,
	h3,
	p {
		margin: 0;
	}

	.audience-card {
		padding: 1.3rem;
		border-radius: 1.8rem;
		background: rgba(255, 255, 255, 0.86);
		box-shadow: 0 18px 44px rgba(17, 17, 17, 0.08);
		display: grid;
		gap: 0.9rem;
	}

	.preview-empty {
		padding: 1.4rem;
		border-radius: 1.8rem;
		background: rgba(255, 255, 255, 0.86);
		box-shadow: 0 18px 44px rgba(17, 17, 17, 0.08);
	}

	.copy,
	.steps article p,
	.audience-card p,
	.preview-empty p {
		margin-top: 0.9rem;
		line-height: 1.75;
	}

	@media (min-width: 768px) {
		.steps,
		.listing-grid,
		.audience-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.preview-actions {
			display: flex;
			flex-wrap: wrap;
		}

		.owner-grid {
			grid-template-columns: minmax(0, 1fr) minmax(22rem, 0.85fr);
			align-items: start;
		}
	}
</style>
