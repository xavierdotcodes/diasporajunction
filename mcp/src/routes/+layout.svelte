<script>
	import '../app.css';
</script>

<svelte:head>
	<title>DiasporaJunxion Directory</title>
	<meta
		name="description"
		content="A trusted directory for diaspora-facing services, businesses, and community resources."
	/>
</svelte:head>

<header class="site-header">
	<a class="brand" href="/directory">DiasporaJunxion</a>
	<nav aria-label="Primary">
		<a href="/directory">Directory</a>
		<a href="/providers">For providers</a>
		<a href="/apply">Apply</a>
		<a href="/dashboard/listings">Dashboard</a>
		<a href="/admin">Admin</a>
	</nav>
</header>

<slot />

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem max(1rem, calc((100vw - 1180px) / 2));
		border-bottom: 1px solid #d8d3c8;
		background: rgba(246, 244, 239, 0.96);
		backdrop-filter: blur(12px);
	}

	.brand {
		font-weight: 900;
		text-decoration: none;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		font-size: 0.92rem;
	}

	nav a {
		text-decoration: none;
	}
</style>
