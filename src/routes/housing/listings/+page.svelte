<script>
	import HousingFilters from '$lib/components/housing/HousingFilters.svelte';
	import HousingListingCard from '$lib/components/housing/HousingListingCard.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('housing.listings.page');

	let { data } = $props();
</script>

<section class="housing-listings-page">
	<div class="shell">
		<SectionHeader
			eyebrow="Housing Listings"
			title="Move through Ghana housing options with a cleaner first pass."
			description="Use the filters lightly. The goal is not endless search complexity, just a better way to sort what may actually fit your move."
		/>

		<div class="top-split">
			<div class="path-card">
				<p class="path-kicker">For Browsers</p>
				<h2>Published listings are open to browse.</h2>
				<p>
					You do not need an account to look through listings or send an inquiry. The point is to make
					the first housing pass feel calmer and more understandable.
				</p>
			</div>

			<div class="path-card accent">
				<p class="path-kicker">For Owners</p>
				<h2>Want to list a Ghana property for diaspora viewers?</h2>
				<p>
					Create a draft, upload photos, and submit it through the owner portal when it is ready for
					review.
				</p>
				<a class="path-link" href={data.housingViewer?.signedIn ? '/housing/owners' : '/housing/list-your-property'}>
					{data.housingViewer?.signedIn ? 'Open Owner Portal' : 'See Owner Path'}
				</a>
			</div>
		</div>

		<div class="page-grid">
			<aside>
				<HousingFilters filters={data.filters} />
			</aside>

			<div class="results">
				<p class="results-count">{data.listings.length} listing{data.listings.length === 1 ? '' : 's'}</p>
				<p class="results-subcopy">
					Property owner?
					<a href="/housing/list-your-property">Submit a listing through DiasporaJunxion.</a>
				</p>

				{#if data.listings.length === 0}
					<div class="empty-state">
						<h2>No listings matched this filter set.</h2>
						<p>Try broadening the location, type, or price range and then scan again.</p>
					</div>
				{:else}
					<div class="listing-grid">
						{#each data.listings as listing}
							<HousingListingCard {listing} />
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.housing-listings-page {
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

	.page-grid,
	.listing-grid,
	.top-split {
		display: grid;
		gap: 1rem;
	}

	.results {
		display: grid;
		gap: 1rem;
	}

	.results-count {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.62);
	}

	.results-subcopy {
		margin: -0.45rem 0 0;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.7);
	}

	.results-subcopy a {
		color: #026b1d;
		font-weight: 700;
		text-decoration: none;
	}

	.path-card,
	.empty-state {
		padding: 1.5rem;
		border-radius: 1.8rem;
		background: rgba(255, 255, 255, 0.88);
		box-shadow: 0 18px 44px rgba(17, 17, 17, 0.08);
	}

	.path-card.accent {
		background:
			radial-gradient(circle at top right, rgba(3, 140, 37, 0.12), transparent 18rem),
			rgba(255, 255, 255, 0.9);
	}

	.path-kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.58);
	}

	.path-card h2,
	.path-card p {
		margin: 0;
	}

	.path-card h2 {
		margin-top: 0.6rem;
		font-size: clamp(1.4rem, 2vw, 2rem);
		line-height: 1.02;
		letter-spacing: -0.04em;
	}

	.path-card p {
		margin-top: 0.8rem;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.72);
	}

	.path-link {
		display: inline-flex;
		margin-top: 1rem;
		font-weight: 700;
		color: #026b1d;
		text-decoration: none;
	}

	.empty-state h2,
	.empty-state p {
		margin: 0;
	}

	.empty-state p {
		margin-top: 0.7rem;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.72);
	}

	@media (min-width: 960px) {
		.top-split {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.page-grid {
			grid-template-columns: minmax(16rem, 0.34fr) minmax(0, 1fr);
			align-items: start;
		}

		aside {
			position: sticky;
			top: 6.5rem;
		}

		.listing-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
