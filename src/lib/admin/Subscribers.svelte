<script>
	import UserItem from './UserItem.svelte';
	import { createEventDispatcher } from 'svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/Subscribers.svelte');
	let { users = [] } = $props();
	const dispatch = createEventDispatcher();

	let subscribers = $derived(users.filter((u) => u.subscribed));

	function handleRemove(id) {
		dispatch('remove', id);
	}
</script>

{#if subscribers.length === 0}
	<p class="text-gray-500 text-center py-4">No subscribers found.</p>
{/if}

<div class="users-list-container">
	{#each subscribers as user (user.id)}
		<UserItem {user} on:remove={() => handleRemove(user.id)} />
	{/each}
</div>
