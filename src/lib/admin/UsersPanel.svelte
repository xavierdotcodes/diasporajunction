<script>
	import UserItem from './UserItem.svelte';
	import { createEventDispatcher } from 'svelte';

	export let users = []; // all users
	const dispatch = createEventDispatcher();

	let filterType = 'all'; // all, subscribers, ndgo, tourees, customers

	// Reactive filtered list
	$: filteredUsers = users.filter((user) => {
		if (filterType === 'subscribers') return user.subscribed;
		if (filterType === 'ndgo') return user.registrations?.length > 0;
		if (filterType === 'tourees') return user.reservations?.length > 0;
		if (filterType === 'customers') return user.orders?.length > 0;
		return true; // fallback: show all
	});

	function handleRemove(id) {
		dispatch('remove', id);
	}

	function handleUnsubscribe(id) {
		dispatch('unsubscribe', id);
	}

	function handleOpenModal(user) {
		// bubble up the click to show modal
		dispatch('openModal', user);
	}
</script>

<!-- Filter selector -->
<div class="filter-bar mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
	<label class="font-semibold text-gray-700">Show:</label>
	<select
		bind:value={filterType}
		class="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
	>
		<option value="all">All Users</option>
		<option value="subscribers">Subscribers</option>
		<option value="ndgo">NDGO</option>
		<option value="tourees">Tourees</option>
		<option value="customers">Customers</option>
	</select>
</div>

{#if filteredUsers.length === 0}
	<p class="text-gray-500 text-center py-4">No users found.</p>
{/if}

<div class="users-list-container max-w-4xl mx-auto">
	{#each filteredUsers as user (user.id)}
		<UserItem
			{user}
			on:remove={(e) => handleRemove(e.detail)}
			on:unsubscribe={(e) => handleUnsubscribe(e.detail)}
			on:openModal={(e) => handleOpenModal(e.detail)}
		/>
	{/each}
</div>

<style>
	.users-list-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1rem;
	}

	@media (min-width: 640px) {
		.users-list-container {
			padding: 1.5rem;
			gap: 2rem;
		}
	}

	@media (min-width: 1024px) {
		.users-list-container {
			padding: 2rem;
			gap: 2.5rem;
		}
	}

	.filter-bar {
		width: 100%;
		justify-content: flex-start;
	}
</style>
