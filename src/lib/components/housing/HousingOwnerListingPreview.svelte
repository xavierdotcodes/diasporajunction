<script>
	import HousingListingCard from '$lib/components/housing/HousingListingCard.svelte';

	let { listing } = $props();
</script>

<div class="preview">
	<p class="eyebrow">Preview</p>
	<h2>How diaspora users will see the listing</h2>
	<p class="copy">
		Keep the copy practical. The goal is clarity, not hype. This preview helps you check how the
		listing reads on mobile before you pay and submit it.
	</p>

	<HousingListingCard listing={listing} />

	<div class="notes-card">
		<h3>Detail page notes</h3>
		<p>{listing.description || 'Add a fuller description so diaspora renters can understand the setup.'}</p>

		{#if listing.diasporaFriendlyNotes}
			<h3>Diaspora notes</h3>
			<p>{listing.diasporaFriendlyNotes}</p>
		{/if}
	</div>
</div>

<style>
	.preview {
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
		color: rgba(217, 4, 43, 0.82);
	}

	h2,
	h3,
	p {
		margin: 0;
	}

	h2,
	h3 {
		letter-spacing: -0.04em;
	}

	.copy,
	.notes-card p {
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.74);
	}

	.notes-card {
		padding: 1.3rem;
		border-radius: 1.8rem;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 18px 44px rgba(17, 17, 17, 0.08);
		display: grid;
		gap: 0.75rem;
	}
</style>
