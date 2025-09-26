<!-- src/routes/+layout.svelte -->
<script>
	import Navbar from '$lib/layout/Navbar.svelte';
	import '../app.css';
</script>

<main>
	<Navbar />
	<slot />
</main>
