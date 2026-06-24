<script>
	let { data } = $props();
</script>

<main class="shell page">
	<h1>Applications</h1>
	<h2>Paid waiting review</h2>
	{#each data.paid as app}
		<a class="card row" href={`/admin/applications/${app._id}`}>{app.businessName} — {app.status}</a>
	{/each}
	<h2>Pending</h2>
	{#each data.pending as app}
		<a class="card row" href={`/admin/applications/${app._id}`}>{app.businessName} — {app.status}</a>
	{/each}
	<h2>Needs resubmission</h2>
	{#each data.resubmission as app}
		<a class="card row" href={`/admin/applications/${app._id}`}>{app.businessName} — {app.status}</a>
	{/each}
</main>

<style>.page { padding: 3rem 0; }.row { display:block; margin:.5rem 0; text-decoration:none; }</style>
