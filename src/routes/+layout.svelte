<!-- src/routes/+layout.svelte -->
<script>
	import Navbar from '$lib/Navbar.svelte';
	import '../app.css';
</script>

<main>
	<Navbar />
	<slot />
</main>
