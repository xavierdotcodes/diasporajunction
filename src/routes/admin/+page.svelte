<script>
	import AdminDashboard from '$lib/admin/AdminDashboard.svelte';
	// Data automatically injected from +page.server.js
	export let data;

	const { tours, spaceOrders, ndgoRegs } = data;
</script>

<main class="p-8 min-h-screen bg-gray-100">
	<h1 class="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
	<AdminDashboard {tours} {spaceOrders} {ndgoRegs} />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: linear-gradient(to right, #f0f4f8, #d9e2ec);
	}
</style>
