<script>
	import UserItem from './UserItem.svelte';
	import { createEventDispatcher } from 'svelte';

	export let users = [];
	export let filterType = 'all'; // comes from parent
	const dispatch = createEventDispatcher();

	$: filteredUsers = users.filter((user) => {
		if (filterType === 'subscribers') return user.subscribed;
		if (filterType === 'ndgo') return user.registrations?.length > 0;
		if (filterType === 'tourees') return user.reservations?.length > 0;
		if (filterType === 'customers') return user.orders?.length > 0;
		return true;
	});

	function handleRemove(id) {
		dispatch('remove', id);
	}

	function handleUnsubscribe(id) {
		dispatch('unsubscribe', id);
	}

	function handleOpenModal(user) {
		dispatch('openModal', user);
	}
</script>

<div class="users-list-container max-w-4xl mx-auto">
	{#if filteredUsers.length === 0}
		<p class="text-gray-500 text-center py-4">No users found.</p>
	{/if}

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
</style>
