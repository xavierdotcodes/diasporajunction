<script>
	let { data } = $props();
</script>

<main class="shell page">
	<h1>Admin</h1>
	<p>Needs attention: {Object.keys(data.summary?.needsAttention ?? {}).length} groups</p>
	<div class="grid two">
		<a class="card" href="/admin/applications">Applications</a>
		<a class="card" href="/admin/listings">Listings</a>
	</div>
</main>

<style>
	.page {
		padding: 3rem 0;
	}
</style>
