<script>
	import { guideTemplates } from '$lib/seo/directory.js';
</script>

<main class="shell page">
	<h1>Ghana service discovery guides</h1>
	<div class="grid two">
		{#each guideTemplates as guide}
			<a class="card" href={`/guides/${guide.slug}`}>{guide.title}</a>
		{/each}
	</div>
</main>

<style>
	.page {
		padding: 3rem 0;
	}
</style>
