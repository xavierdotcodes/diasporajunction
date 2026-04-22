<script>
	import Button from '$lib/components/ui/Button.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('housing.owner.marketing.page');

	let { data } = $props();

	const nextStepCards = $derived([
		{
			title: data.housingViewer.signedIn ? 'Go to your owner portal' : 'Create your owner account',
			copy: data.housingViewer.signedIn
				? 'You already have access. Open the owner portal to start a draft or manage listings you already submitted.'
				: 'Start with a simple owner account so your drafts, uploads, and payment status are tied to you.',
			href: data.housingViewer.signedIn ? '/housing/owners' : '/signup?next=/housing/owners',
			cta: data.housingViewer.signedIn ? 'Open Owner Portal' : 'Create Owner Account'
		},
		{
			title: 'Already have an account?',
			copy: 'Sign in and continue from your owner dashboard. That is where your drafts, uploads, and submission status live.',
			href: '/login?next=/housing/owners',
			cta: 'Sign In'
		}
	]);
</script>

<div class="owner-page">
	<Hero
		variant="page"
		subtitle="List Your Property"
		description="DiasporaJunxion helps property owners in Ghana present listings in a cleaner, diaspora-facing way for returnees, renters, and families exploring relocation."
		imageSrc="/images/keys.jpg"
		imageAlt="Apartment keys held above a table"
	>
		{#snippet title()}
			<h1>List your Ghana property for diaspora renters without pretending this is a giant marketplace.</h1>
		{/snippet}

		{#snippet cta()}
			<div class="hero-actions">
				<Button
					href={data.housingViewer.signedIn ? '/housing/owners' : '/signup?next=/housing/owners'}
					variant="brand"
					size="lg"
				>
					{data.housingViewer.signedIn ? 'Open Owner Portal' : 'Create Owner Account'}
				</Button>
				<Button href="/housing/listings" variant="outline" size="lg">Browse Current Listings</Button>
			</div>
		{/snippet}
	</Hero>

	<section class="section">
		<div class="shell">
			<SectionHeader
				eyebrow="How It Works"
				title={`A small $${data.ownerListingFeeUsd} fee to submit a listing for review.`}
				description="This is a lean submission flow for owners, landlords, agents, and developers who want DiasporaJunxion to position their listing for a diaspora audience."
			/>

			<div class="steps">
				<article>
					<h3>1. Create your listing draft</h3>
					<p>Add the basics, upload photos, and preview how the listing will read to diaspora renters or relocating families.</p>
				</article>
				<article>
					<h3>2. Pay and submit</h3>
					<p>Pay the one-time listing fee through Stripe when the draft is ready to send for review.</p>
				</article>
				<article>
					<h3>3. DiasporaJunxion reviews and publishes</h3>
					<p>Listings can be reviewed before publication so the housing section stays cleaner and more useful than random classifieds.</p>
				</article>
			</div>
		</div>
	</section>

	<section class="section section-cta">
		<div class="shell">
			<SectionHeader
				eyebrow="Next Step"
				title="The owner path continues in the owner portal."
				description="That is where owners create drafts, upload photos, pay the submission fee, and check listing status after review."
			/>

			<div class="next-grid">
				{#each nextStepCards as card}
					<article class="next-card">
						<h3>{card.title}</h3>
						<p>{card.copy}</p>
						<Button href={card.href} variant="brand" size="lg">{card.cta}</Button>
					</article>
				{/each}
			</div>

			<div class="admin-note">
				<p class="note-kicker">After Payment</p>
				<p>
					Submitted listings do not publish themselves automatically. They move into review first, so
					DiasporaJunxion can keep the public housing layer cleaner and more trustworthy.
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	.owner-page {
		background: #f8f2df;
		color: #111111;
	}

	.shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
	}

	.section {
		padding: 4.5rem 0;
	}

	.section-cta {
		padding-top: 0;
	}

	.hero-actions,
	.steps,
	.next-grid {
		display: grid;
		gap: 1rem;
	}

	.steps article,
	.next-card,
	.admin-note {
		padding: 1.35rem;
		border-radius: 1.8rem;
		background: rgba(255, 255, 255, 0.88);
		box-shadow: 0 18px 44px rgba(17, 17, 17, 0.08);
	}

	h3,
	p {
		margin: 0;
	}

	p {
		margin-top: 0.75rem;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.74);
	}

	.next-card {
		display: grid;
		gap: 0.95rem;
	}

	.note-kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.56);
	}

	.admin-note {
		margin-top: 1rem;
	}

	@media (min-width: 768px) {
		.hero-actions {
			display: flex;
			flex-wrap: wrap;
		}

		.steps {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.next-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
