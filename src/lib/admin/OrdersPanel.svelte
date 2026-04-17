<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/OrdersPanel.svelte');

	let { orders = [] } = $props();
</script>

{#if orders.length === 0}
	<p class="text-gray-500 text-center py-4">No orders found.</p>
{/if}

<div class="orders-list-container">
	{#each orders as order (order.id)}
		<div
			class="order-item p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 bg-gradient-to-r from-green-400 to-green-600 text-white"
		>
			<div class="flex flex-col sm:flex-row sm:items-center gap-2">
				<p class="font-semibold">Order #{order.id}</p>
				<p class="sm:ml-4">{order.user.name}</p>
				<p class="sm:ml-4">{order.status}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.orders-list-container {
		max-width: 1000px; /* align with ToursPanel */
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.orders-list-container {
			padding: 1.5rem;
			gap: 2rem;
		}
	}

	@media (min-width: 1024px) {
		.orders-list-container {
			padding: 2rem;
			gap: 2.5rem;
		}
	}

	.order-item {
		width: 100%;
		box-sizing: border-box;
	}
</style>
