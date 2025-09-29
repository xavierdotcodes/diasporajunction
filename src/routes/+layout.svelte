<!-- src/routes/+layout.svelte -->
<script>
	import Navbar from '$lib/layout/Navbar.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>DiasporaJunxion – Connecting the Diaspora</title>

	<!-- Open Graph / WhatsApp / Facebook -->
	<meta property="og:title" content="DiasporaJunxion – Connecting the Diaspora" />
	<meta
		property="og:description"
		content="Discover opportunities, events, and networks tailored for the African diaspora. Build connections, grow, and thrive globally."
	/>
	<meta property="og:image" content="https://diasporajunxion.com/logo2.png" />
	<meta property="og:url" content="https://diasporajunxion.com" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />

	<!-- Optional: Facebook App ID -->
	<meta property="fb:app_id" content="YOUR_FB_APP_ID" />

	<!-- Twitter fallback -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="DiasporaJunxion – Connecting the Diaspora" />
	<meta
		name="twitter:description"
		content="Discover opportunities, events, and networks tailored for the African diaspora. Build connections, grow, and thrive globally."
	/>
	<meta name="twitter:image" content="https://diasporajunxion.com/logo2.png" />
</svelte:head>

<!-- The important part -->
<div class="flex flex-col min-h-screen">
	<Navbar />

	<main class="flex-1">
		<slot />
	</main>

	<Footer />
</div>
