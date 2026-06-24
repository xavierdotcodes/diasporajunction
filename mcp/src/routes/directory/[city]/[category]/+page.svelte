<script>
	let { data } = $props();
</script>

<main class="shell page">
	<h1>{data.category} services in {data.city}</h1>
	<p>Directory results for this city and category will use active public listings only.</p>
</main>

<style>
	.page {
		padding: 3rem 0;
	}
</style>
