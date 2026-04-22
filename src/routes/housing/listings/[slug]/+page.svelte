<script>
	import HousingListingCard from '$lib/components/housing/HousingListingCard.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('housing.listing.detail.page');

	let { data, form } = $props();

	const images = $derived(data.listing.images?.length ? data.listing.images : [{ url: '/images/keys.jpg' }]);
	const priceLabel = $derived(
		data.listing.priceAmount
			? `${data.listing.currency} ${data.listing.priceAmount.toLocaleString()}${data.listing.pricePeriod ? ` / ${data.listing.pricePeriod}` : ''}`
			: 'Pricing shared after inquiry'
	);
	const quickFacts = $derived([
		{
			label: 'Price',
			value: priceLabel
		},
		{
			label: 'Bedrooms',
			value: data.listing.bedrooms ? `${data.listing.bedrooms}` : 'Flexible layout'
		},
		{
			label: 'Bathrooms',
			value: data.listing.bathrooms ? `${data.listing.bathrooms}` : 'Ask for details'
		},
		{
			label: 'Availability',
			value: data.listing.availabilityText || 'Ask via inquiry'
		}
	]);
	const inquirySteps = [
		'Ask only what matters for your move, budget, or family setup.',
		'DiasporaJunxion receives the inquiry tied to this exact listing.',
		'You can use the message box to ask about fit, timing, or neighborhood context.'
	];
	const requesterName = $derived(form?.values?.requesterName ?? data.housingViewer.firstName ?? '');
	const requesterEmail = $derived(form?.values?.requesterEmail ?? data.housingViewer.email ?? '');
	const requesterPhone = $derived(form?.values?.requesterPhone ?? '');
	const moveTimeline = $derived(form?.values?.moveTimeline ?? '');
	const message = $derived(form?.values?.message ?? '');
</script>

<section class="listing-detail-page">
	<div class="shell">
		<div class="breadcrumb-row">
			<a href="/housing">Housing</a>
			<span>/</span>
			<a href="/housing/listings">Listings</a>
			<span>/</span>
			<strong>{data.listing.title}</strong>
		</div>

		<div class="hero-grid">
			<div class="gallery-card">
				<div class="gallery">
					<img class="hero-image" src={images[0].url} alt={data.listing.title} />
					{#if images.length > 1}
						<div class="thumb-grid">
							{#each images.slice(1, 5) as image}
								<img src={image.url} alt={data.listing.title} />
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<div class="hero-copy">
				<p class="eyebrow">Diaspora Housing</p>
				<h1>{data.listing.title}</h1>
				<p class="location">
					{data.listing.location}{data.listing.neighborhood ? `, ${data.listing.neighborhood}` : ''}
				</p>
				<p class="summary">{data.listing.summary}</p>

				<div class="chips">
					<span>{data.listing.listingType.replace('_', ' ')}</span>
					<span>{data.listing.stayType.replace('_', ' ')}</span>
					<span>{priceLabel}</span>
					{#if data.listing.furnished}
						<span>Furnished</span>
					{/if}
					{#if data.listing.familyFriendly}
						<span>Family-friendly</span>
					{/if}
				</div>

				<div class="hero-note">
					<p class="note-kicker">Why this page exists</p>
					<p>
						The goal is to give diaspora browsers a cleaner first read before they start chasing random
						listings or fragmented WhatsApp forwards.
					</p>
				</div>
			</div>
		</div>

		<div class="detail-grid">
			<div class="main-column">
				<div class="facts-grid">
					{#each quickFacts as fact}
						<article class="fact-card">
							<p>{fact.label}</p>
							<strong>{fact.value}</strong>
						</article>
					{/each}
				</div>

				<div class="content-card">
					<p class="section-kicker">Listing Overview</p>
					<h2>What to know</h2>
					<p>{data.listing.description}</p>

					{#if data.listing.diasporaFriendlyNotes}
						<div class="info-block">
							<h3>Diaspora notes</h3>
							<p>{data.listing.diasporaFriendlyNotes}</p>
						</div>
					{/if}

					{#if data.listing.availabilityText}
						<div class="info-block">
							<h3>Availability</h3>
							<p>{data.listing.availabilityText}</p>
						</div>
					{/if}

					{#if data.listing.inquiryDestination || data.listing.contactMethod}
						<div class="info-block">
							<h3>Inquiry route</h3>
							<p>
								{data.listing.contactMethod || 'Direct inquiry'}
								{#if data.listing.inquiryDestination}
									: {data.listing.inquiryDestination}
								{/if}
							</p>
						</div>
					{/if}

					{#if data.listing.providerName}
						<div class="info-block">
							<h3>Listed by</h3>
							<p>{data.listing.providerName}</p>
						</div>
					{/if}
				</div>
			</div>

			<div class="sidebar">
				<div class="inquiry-card">
					<p class="section-kicker">Inquiry</p>
					<h2>Ask about fit before you commit time.</h2>
					<p class="sidebar-copy">
						Use this form when the listing actually fits your move, family situation, budget, or timeline.
					</p>

					<div class="inquiry-steps">
						{#each inquirySteps as step}
							<div>{step}</div>
						{/each}
					</div>

					<form method="POST" action="?/inquire" class="inquiry-form">
						<label>
							<span>Name</span>
							<input
								name="requesterName"
								placeholder={data.housingViewer.firstName || 'Your name'}
								value={requesterName}
							/>
						</label>
						<label>
							<span>Email</span>
							<input
								type="email"
								name="requesterEmail"
								placeholder="you@example.com"
								value={requesterEmail}
								required
							/>
						</label>
						<label>
							<span>Phone / WhatsApp</span>
							<input name="requesterPhone" placeholder="Optional" value={requesterPhone} />
						</label>
						<label>
							<span>Move timeline</span>
							<input name="moveTimeline" placeholder="e.g. within 3 months" value={moveTimeline} />
						</label>
						<label>
							<span>Your question</span>
							<textarea
								name="message"
								rows="5"
								placeholder="What do you want to know about the listing, the area, or the fit for your move?"
								required
							>{message}</textarea>
						</label>

						{#if form?.error}
							<p class="status error">{form.error}</p>
						{/if}

						{#if form?.success}
							<p class="status success">
								Inquiry sent. DiasporaJunxion now has it tied to this listing.
							</p>
						{/if}

						<button type="submit">Send Inquiry</button>
					</form>
				</div>

				<div class="sidebar-note">
					<p class="section-kicker">For Owners</p>
					<h3>Have a Ghana property to submit?</h3>
					<p>
						DiasporaJunxion also has an owner portal for landlords, agents, and developers who want
						to present listings in a more diaspora-facing way.
					</p>
					<a href={data.housingViewer.signedIn ? '/housing/owners' : '/housing/list-your-property'}>
						{data.housingViewer.signedIn ? 'Open owner portal' : 'See owner flow'}
					</a>
				</div>
			</div>
		</div>

		{#if data.relatedListings.length > 0}
			<div class="related-section">
				<div class="related-header">
					<div>
						<p class="section-kicker">More Options</p>
						<h2>Related listings to compare next</h2>
					</div>
				</div>
				<div class="related-grid">
					{#each data.relatedListings as listing}
						<HousingListingCard {listing} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.listing-detail-page {
		padding: clamp(3rem, 6vw, 5rem) 0 5rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.breadcrumb-row,
	.hero-grid,
	.detail-grid,
	.related-grid,
	.thumb-grid,
	.facts-grid,
	.inquiry-steps {
		display: grid;
		gap: 1rem;
	}

	.breadcrumb-row {
		grid-auto-flow: column;
		grid-auto-columns: max-content;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 1rem;
		font-size: 0.92rem;
		color: rgba(17, 17, 17, 0.65);
	}

	.breadcrumb-row a {
		color: #026b1d;
		text-decoration: none;
		font-weight: 700;
	}

	.gallery,
	.main-column {
		display: grid;
		gap: 1rem;
	}

	.gallery-card,
	.hero-copy,
	.content-card,
	.inquiry-card,
	.sidebar-note,
	.fact-card {
		padding: 1.4rem;
		border-radius: 2rem;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 18px 44px rgba(17, 17, 17, 0.08);
	}

	.inquiry-card {
		background:
			radial-gradient(circle at top right, rgba(3, 140, 37, 0.1), transparent 16rem),
			rgba(255, 255, 255, 0.94);
	}

	.hero-image,
	.thumb-grid img {
		width: 100%;
		object-fit: cover;
		border-radius: 2rem;
		box-shadow: 0 20px 48px rgba(17, 17, 17, 0.12);
	}

	.hero-image {
		height: 18rem;
	}

	.thumb-grid img {
		height: 7rem;
	}

	.eyebrow,
	.section-kicker,
	.note-kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.eyebrow {
		color: rgba(217, 4, 43, 0.82);
	}

	.section-kicker,
	.note-kicker,
	.fact-card p {
		color: rgba(17, 17, 17, 0.56);
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1,
	h2,
	h3 {
		letter-spacing: -0.04em;
	}

	h1 {
		margin-top: 0.8rem;
		font-size: clamp(2rem, 4vw, 3.4rem);
		line-height: 0.95;
	}

	h2 {
		font-size: clamp(1.5rem, 2vw, 2.2rem);
		line-height: 1;
	}

	.location,
	.summary,
	.content-card p,
	.sidebar-copy,
	.hero-note p,
	.sidebar-note p {
		margin-top: 0.9rem;
		line-height: 1.75;
		color: rgba(17, 17, 17, 0.78);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-top: 1rem;
	}

	.chips span {
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

	.hero-note {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 1.4rem;
		background: #faf5e5;
	}

	.facts-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.fact-card strong {
		display: block;
		margin-top: 0.45rem;
		font-size: 1.05rem;
		line-height: 1.3;
	}

	.info-block + .info-block,
	.content-card h2 + p {
		margin-top: 1.2rem;
	}

	.inquiry-steps div {
		padding: 0.9rem 1rem;
		border-radius: 1.2rem;
		background: rgba(255, 255, 255, 0.72);
		line-height: 1.65;
		color: rgba(17, 17, 17, 0.76);
	}

	.inquiry-form {
		display: grid;
		gap: 0.85rem;
		margin-top: 1rem;
	}

	label {
		display: grid;
		gap: 0.4rem;
	}

	label span {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.6);
	}

	input,
	textarea,
	button {
		border-radius: 1.2rem;
		border: 1px solid rgba(17, 17, 17, 0.12);
		background: white;
		padding: 0.85rem 1rem;
	}

	button {
		min-height: 3rem;
		border-radius: 999px;
		border: 0;
		background: linear-gradient(135deg, #038c25, #026b1d);
		color: white;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}

	.status {
		font-size: 0.95rem;
	}

	.status.success {
		color: #026b1d;
	}

	.status.error {
		color: #b10323;
	}

	.sidebar {
		display: grid;
		gap: 1rem;
		align-content: start;
	}

	.sidebar-note a {
		display: inline-flex;
		margin-top: 1rem;
		font-weight: 700;
		color: #026b1d;
		text-decoration: none;
	}

	.related-section {
		margin-top: 2rem;
	}

	.related-grid {
		margin-top: 1rem;
	}

	@media (min-width: 760px) {
		.thumb-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 900px) {
		.hero-grid {
			grid-template-columns: minmax(0, 1.1fr) minmax(22rem, 0.9fr);
			align-items: start;
		}

		.detail-grid {
			grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.42fr);
			align-items: start;
		}

		.sidebar {
			position: sticky;
			top: 6.5rem;
		}

		.related-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
