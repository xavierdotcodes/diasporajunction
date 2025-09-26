<script>
	export let links = [
		{ label: 'Terms of Service', url: '/terms-of-service' },
		{ label: 'Privacy Policy', url: '/privacy-policy' },
		{ label: 'Refund Policy', url: '/refund-policy' },
		{ label: 'Shipping Policy', url: '/shipping-policy' }
	];
</script>

<nav class="footer-menu">
	{#each links as { label, url }}
		<a href={url} class="footer-link">{label}</a>
	{/each}
</nav>

<style>
	.footer-menu {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 0.5rem;
	}

	.footer-link {
		color: black;
		font-size: 0.85rem;
		text-decoration: underline;
		transition: color 0.2s;
	}

	.footer-link:hover {
		color: white;
	}
</style>
