<script>
	import { stopPropagation } from 'svelte/legacy';

	import { createEventDispatcher } from 'svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/UserItem.svelte');
	let { user } = $props();

	const dispatch = createEventDispatcher();

	function handleRemove() {
		dispatch('remove', user.id);
	}

	function handleUnsubscribe() {
		dispatch('unsubscribe', user.id);
	}

	function openModal() {
		dispatch('openModal', user);
	}
</script>

<div
	class="user-item flex justify-between items-center p-4 rounded-lg shadow-md hover:shadow-xl transition-all bg-white cursor-pointer border border-gray-200"
	role="button"
	tabindex="0"
	aria-label={`Open details for ${user.name}`}
	onclick={openModal}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openModal();
		}
	}}
>
	<div class="flex-1 min-w-0">
		<p class="font-semibold text-gray-900 truncate text-lg">{user.name}</p>
		<p class="text-sm text-gray-500 truncate">{user.email}</p>
		<div class="mt-1 flex flex-wrap gap-2">
			{#each user.roles ?? [] as r}
				<span
					class="px-2 py-0.5 rounded-full text-xs font-medium
					{r.role === 'ADMIN' ? 'bg-red-100 text-red-800' : ''}
					{r.role === 'STUDENT' ? 'bg-blue-100 text-blue-800' : ''}
					{r.role === 'TEACHER' ? 'bg-green-100 text-green-800' : ''}
					{r.role === 'PROSPECT' ? 'bg-yellow-100 text-yellow-800' : ''}
					{r.role === 'TOUREE' ? 'bg-purple-100 text-purple-800' : ''}"
				>
					{r.role}
				</span>
			{/each}
		</div>
	</div>

	<div class="flex flex-row sm:flex-col gap-2 sm:gap-1 flex-shrink-0 ml-4">
		{#if user.subscribed}
			<button
				type="button"
				class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-1 px-3 rounded-lg transition"
				onclick={stopPropagation(handleUnsubscribe)}
			>
				Unsubscribe
			</button>
		{/if}

		{#if !user.roles?.some((r) => r.role === 'ADMIN')}
			<button
				type="button"
				class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition"
				onclick={stopPropagation(handleRemove)}
			>
				Remove
			</button>
		{/if}
	</div>
</div>

<style>
	.user-item {
		width: 100%;
		box-sizing: border-box;
	}
	.user-item:hover {
		transform: translateY(-2px);
	}
</style>
