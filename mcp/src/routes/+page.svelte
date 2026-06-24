<script>
	import { directoryCategories, categoryDisplayName } from '$lib/directory/constants.js';
</script>

<main class="home">
	<section class="shell hero">
		<div>
			<p class="eyebrow">Trusted directory</p>
			<h1>Find verified people and services for Ghana and the diaspora.</h1>
			<p>
				DiasporaJunxion starts as a directory-first product: searchable listings, reviewable
				applications, proof of attention, and AI-assisted discovery.
			</p>
			<div class="actions">
				<a class="button" href="/directory">Browse directory</a>
				<a class="button secondary" href="/apply">Apply to be listed</a>
			</div>
		</div>
		<div class="hero-panel">
			<h2>Directory categories</h2>
			<div class="chips">
				{#each directoryCategories.slice(0, 10) as category}
					<a class="badge" href={`/directory/category/${category}`}>{categoryDisplayName(category)}</a>
				{/each}
			</div>
		</div>
	</section>
</main>

<style>
	.home {
		padding: 4rem 0;
	}

	.hero {
		display: grid;
		gap: 1.5rem;
		align-items: start;
	}

	.eyebrow {
		margin: 0 0 0.7rem;
		color: #b45f2a;
		font-weight: 900;
		text-transform: uppercase;
	}

	h1 {
		max-width: 760px;
		margin: 0;
		font-size: clamp(2.3rem, 6vw, 5rem);
		line-height: 0.98;
	}

	p {
		max-width: 680px;
		line-height: 1.7;
	}

	.actions,
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.hero-panel {
		border: 1px solid #d8d3c8;
		border-radius: 0.5rem;
		background: #ffffff;
		padding: 1rem;
	}

	@media (min-width: 900px) {
		.hero {
			grid-template-columns: 1.45fr 0.8fr;
		}
	}
</style>
