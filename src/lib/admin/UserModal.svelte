<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/UserModal.svelte');

	let { activeUser, onClose } = $props();
</script>

<div class="user-modal p-4 bg-white shadow-lg rounded-lg w-80">
	<h2 class="font-bold text-lg mb-2">{activeUser.name}</h2>
	<p class="text-sm text-gray-600 mb-2">{activeUser.email}</p>

	{#if activeUser.registrations?.length > 0}
		<p>NDGO course(s): {activeUser.registrations.length}</p>
	{/if}

	{#if activeUser.reservations?.length > 0}
		<p>Tour(s) booked: {activeUser.reservations.length}</p>
	{/if}

	{#if activeUser.orders?.length > 0}
		<p>Orders: {activeUser.orders.length}</p>
	{/if}

	<button class="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onclick={onClose}>
		Close
	</button>
</div>

<style>
	.user-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 50;
	}
</style>
