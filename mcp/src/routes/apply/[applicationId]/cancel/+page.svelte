<script>
	let { data } = $props();
</script>

<main class="shell page">
	<h1>Payment cancelled</h1>
	<p>Your application was not marked paid. You can restart checkout when ready.</p>
	<a class="button" href={`/apply/${data.applicationId}/payment`}>Restart payment</a>
</main>

<style>.page { padding: 3rem 0; }</style>
