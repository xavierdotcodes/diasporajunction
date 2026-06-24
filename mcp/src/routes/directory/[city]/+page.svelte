<script>
	let { data } = $props();
</script>

<main class="shell page">
	<h1>Trusted services in {data.city}</h1>
	<p>Find public directory listings serving {data.city} and nearby areas.</p>
</main>

<style>
	.page {
		padding: 3rem 0;
	}
</style>
