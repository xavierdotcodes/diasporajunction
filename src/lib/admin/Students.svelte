<script>
	import UserItem from './UserItem.svelte';
	import { createEventDispatcher } from 'svelte';
	export let users = [];
	const dispatch = createEventDispatcher();

	$: students = users.filter((u) => u.registrations?.length > 0);

	function handleRemove(id) {
		dispatch('remove', id);
	}
</script>

{#if students.length === 0}
	<p class="text-gray-500 text-center py-4">No students found.</p>
{/if}

<div class="users-list-container">
	{#each students as user (user.id)}
		<UserItem {user} on:remove={() => handleRemove(user.id)} />
	{/each}
</div>
