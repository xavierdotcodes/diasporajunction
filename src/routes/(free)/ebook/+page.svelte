<script>
	import EbookCheckoutCard from '$lib/components/ebook/Checkout.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { EBOOK_PRICE_USD } from '$lib/ebook/config';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.ebook.page');

	let { data } = $props();

	const viewer = $derived(
		data.ebookViewer ?? {
			email: '',
			hasPurchase: false,
			purchaseDate: null
		}
	);

	const checkoutMessage = $derived(data.checkoutResult?.status ?? null);
	const requestEmail = $derived(viewer.email ?? data.user?.email ?? '');
	const requestFirstName = $derived(data.user?.name?.split(' ')[0] ?? '');

	const chapterCards = [
		{
			eyebrow: '01',
			title: 'Family readiness',
			description:
				'How to think about the move when children, stability, support systems, and rhythm matter as much as inspiration.'
		},
		{
			eyebrow: '02',
			title: 'School, home, and routine',
			description:
				'Questions to ask early about schooling, everyday life, and what has to feel sustainable before the move can feel wise.'
		},
		{
			eyebrow: '03',
			title: 'Belonging beyond logistics',
			description:
				'The emotional and social side of settling with a family, not just the checklist side.'
		}
	];

	const unlockedCards = [
		{
			title: 'Family move lens',
			description:
				'A tighter framework for evaluating whether you are looking at Ghana as a visit, a trial stay, or a family relocation.'
		},
		{
			title: 'Stability questions',
			description:
				'The questions that matter when children, support systems, and everyday rhythm need to hold.'
		},
		{
			title: 'Decision prompts',
			description:
				'A clearer set of prompts for aligning timing, readiness, schooling, and expectations.'
		}
	];
</script>

<article class="ebook-page">
	<section class="ebook-hero">
		<div class="ebook-shell hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">Paid Guide</p>
				<h1>Thriving in Ghana (With Children)</h1>
				<p class="hero-description">
					A practical digital guide for diaspora families and long-term thinkers who want more than
					scattered posts, travel fantasy, or generic relocation optimism.
				</p>
				<div class="hero-meta">
					<span>Digital purchase</span>
					<span>${EBOOK_PRICE_USD}</span>
					<span>Family-focused</span>
				</div>
			</div>

			<div class="hero-panel">
				<p class="panel-kicker">{viewer.hasPurchase ? 'Purchase Active' : 'What It Is'}</p>
				{#if viewer.hasPurchase}
					<h2>You have access to the ebook layer.</h2>
					<p>
						This purchase is now tied to <strong>{viewer.email}</strong>. Use this page as the
						ebook entry point while the digital delivery layer continues to expand.
					</p>
				{:else}
					<h2>A deeper guide for family decisions.</h2>
					<p>
						This is for the phase where the move stops being abstract and starts involving family
						stability, support systems, schooling questions, and long-term rhythm.
					</p>
				{/if}
			</div>
		</div>
	</section>

	{#if checkoutMessage}
		<section class="ebook-banner-section">
			<div class="ebook-shell">
				<div class={`checkout-banner ${checkoutMessage}`}>
					<p class="banner-kicker">
						{checkoutMessage === 'success'
							? 'Purchase Complete'
							: checkoutMessage === 'canceled'
								? 'Checkout Canceled'
								: 'Checkout Error'}
					</p>
					<p>
						{#if checkoutMessage === 'success'}
							The ebook purchase was recorded successfully. This browser now has access to the paid ebook layer.
						{:else if checkoutMessage === 'canceled'}
							The ebook checkout was canceled before payment completed.
						{:else}
							We could not verify the ebook checkout automatically.
						{/if}
					</p>
				</div>
			</div>
		</section>
	{/if}

	<section class="ebook-section section-cream">
		<div class="ebook-shell">
			<SectionHeader
				eyebrow="What This Guide Covers"
				title="Built for the questions that get heavier once children and daily life enter the frame."
				description="The ebook is not meant to replace the public site. It is meant to go deeper where family planning, emotional weight, and long-term sustainability matter."
			/>

			<div class="chapter-grid">
				{#each chapterCards as item}
					<article class="chapter-card">
						<p class="chapter-eyebrow">{item.eyebrow}</p>
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	{#if viewer.hasPurchase}
		<section class="ebook-section section-dark">
			<div class="ebook-shell">
				<SectionHeader
					eyebrow="Unlocked"
					title="Your purchased layer is now open."
					description="This purchase now unlocks the deeper family-planning layer inside DiasporaJunxion. As the product expands, this area is where download delivery and buyer-only updates can live."
					tone="dark"
				/>

				<div class="unlocked-grid">
					{#each unlockedCards as item}
						<article class="unlocked-card">
							<h3>{item.title}</h3>
							<p>{item.description}</p>
						</article>
					{/each}
				</div>

				<div class="buyer-note">
					<p class="buyer-note-kicker">Buyer Status</p>
					<p>
						Access is currently tied to <strong>{viewer.email}</strong>{#if viewer.purchaseDate}
							, recorded on {new Date(viewer.purchaseDate).toLocaleDateString()}
						{/if}.
					</p>
				</div>
			</div>
		</section>
	{:else}
		<section class="ebook-section section-dark">
			<div class="ebook-shell purchase-grid">
				<div class="purchase-copy">
					<SectionHeader
						eyebrow="Purchase"
						title="Buy the family-specific layer when you need more than public orientation."
						description="Public pages can help you think about Ghana broadly. This guide is for the more specific questions that surface when children, routine, support, and sustainability become central."
						tone="dark"
					/>

					<div class="purchase-points">
						<p>Useful if you are moving with children or planning around them.</p>
						<p>Useful if you are past broad inspiration and need a more structured lens.</p>
						<p>Useful if you want a tighter bridge between free orientation and deeper planning.</p>
					</div>
				</div>

				<EbookCheckoutCard
					email={requestEmail}
					firstName={requestFirstName}
					source={data.user ? 'ebook_checkout_authenticated' : 'ebook_checkout_public'}
				/>
			</div>
		</section>
	{/if}

	<section class="ebook-section section-green">
		<div class="ebook-shell">
			<StrategicCta
				eyebrow="Next Step"
				title="Use the ebook for family-specific depth. Use Community for the broader live layer."
				description="The ebook is a focused paid guide. Community is the wider member workspace for current signals, resources, tools, and deeper support."
				primaryHref="/community"
				primaryLabel="Explore Community"
				secondaryHref="/start-here"
				secondaryLabel="Start Free First"
				tone="light"
			/>
		</div>
	</section>
</article>

<style>
	.ebook-page {
		background: #f8f2df;
		color: #111111;
	}

	.ebook-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.ebook-hero,
	.ebook-section {
		padding: clamp(4.75rem, 7vw, 6.5rem) 0;
	}

	.ebook-hero {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.24), transparent 28rem),
			linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
	}

	.section-cream {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 24rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.section-dark {
		background:
			radial-gradient(circle at top left, rgba(217, 4, 43, 0.12), transparent 24rem),
			radial-gradient(circle at bottom right, rgba(242, 183, 5, 0.12), transparent 26rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.section-green {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 22rem),
			linear-gradient(180deg, #038c25 0%, #026b1d 100%);
	}

	.hero-grid,
	.purchase-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(19rem, 0.72fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: start;
	}

	.eyebrow,
	.panel-kicker,
	.banner-kicker,
	.chapter-eyebrow,
	.buyer-note-kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.eyebrow,
	.chapter-eyebrow {
		color: rgba(217, 4, 43, 0.84);
	}

	.hero-copy h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.6rem, 5vw, 5.2rem);
		line-height: 0.93;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.hero-description,
	.hero-panel p,
	.purchase-points p,
	.chapter-card p,
	.unlocked-card p {
		font-size: clamp(1rem, 1.32vw, 1.14rem);
		line-height: 1.8;
	}

	.hero-description {
		margin: 1.2rem 0 0;
		max-width: 42rem;
		color: rgba(17, 17, 17, 0.78);
	}

	.hero-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-top: 1.5rem;
	}

	.hero-meta span {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		background: rgba(17, 17, 17, 0.06);
		font-size: 0.88rem;
		font-weight: 700;
		color: rgba(17, 17, 17, 0.72);
	}

	.hero-panel {
		padding: 1.45rem;
		border-radius: 1.8rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 56%),
			linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: white;
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.18);
	}

	.panel-kicker,
	.banner-kicker,
	.buyer-note-kicker {
		color: rgba(242, 183, 5, 0.9);
	}

	.hero-panel h2,
	.chapter-card h3,
	.unlocked-card h3 {
		margin: 0;
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.hero-panel h2 {
		font-size: clamp(1.6rem, 2.3vw, 2.2rem);
	}

	.hero-panel p {
		margin: 0.95rem 0 0;
		color: rgba(255, 248, 239, 0.8);
	}

	.hero-panel strong,
	.buyer-note strong {
		color: #fff8ef;
	}

	.ebook-banner-section {
		padding: 1.4rem 0 0;
		background: linear-gradient(180deg, #111111 0%, #050505 100%);
	}

	.checkout-banner {
		padding: 1rem 1.2rem;
		border-radius: 1.4rem;
		background: rgba(255, 255, 255, 0.06);
		color: white;
	}

	.checkout-banner.success {
		background: rgba(3, 140, 37, 0.16);
	}

	.checkout-banner.canceled {
		background: rgba(242, 183, 5, 0.12);
	}

	.checkout-banner.error {
		background: rgba(217, 4, 43, 0.14);
	}

	.checkout-banner p:last-child {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.7;
		color: rgba(255, 248, 239, 0.82);
	}

	.chapter-grid,
	.unlocked-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.chapter-card,
	.unlocked-card {
		padding: 1.35rem;
		border-radius: 1.55rem;
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
	}

	.chapter-card {
		background: linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
	}

	.chapter-card h3 {
		font-size: 1.4rem;
		color: #111111;
	}

	.chapter-card p {
		margin: 0.85rem 0 0;
		color: rgba(17, 17, 17, 0.76);
	}

	.unlocked-card {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
	}

	.unlocked-card h3 {
		font-size: 1.35rem;
		color: #fff8ef;
	}

	.unlocked-card p {
		margin: 0.85rem 0 0;
		color: rgba(255, 248, 239, 0.78);
	}

	.buyer-note {
		margin-top: 1.4rem;
		padding: 1rem 1.1rem;
		border-radius: 1.3rem;
		background: rgba(255, 255, 255, 0.06);
	}

	.buyer-note p:last-child {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.72;
		color: rgba(255, 248, 239, 0.78);
	}

	.purchase-points {
		display: grid;
		gap: 0.9rem;
		margin-top: 1.35rem;
	}

	.purchase-points p {
		margin: 0;
		color: rgba(255, 248, 239, 0.78);
	}

	@media (max-width: 960px) {
		.ebook-shell {
			padding-inline: 1rem;
		}

		.hero-grid,
		.purchase-grid,
		.chapter-grid,
		.unlocked-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
