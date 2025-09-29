<script>
	import { createEventDispatcher } from 'svelte';
	export let user;

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
	class="user-item flex justify-between items-center p-4 border rounded hover:bg-gray-100 transition shadow cursor-pointer"
	on:click={openModal}
>
	<div class="flex-1 min-w-0">
		<p class="font-semibold truncate">{user.name}</p>
		<p class="text-sm text-gray-600 truncate">{user.email}</p>
	</div>

	<div class="flex flex-row sm:flex-col gap-2 sm:gap-1 flex-shrink-0">
		{#if user.subscribed}
			<button
				class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-1 px-3 rounded transition"
				on:click|stopPropagation={handleUnsubscribe}
			>
				Unsubscribe
			</button>
		{/if}

		<button
			class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition"
			on:click|stopPropagation={handleRemove}
		>
			Remove
		</button>
	</div>
</div>

<style>
	.user-item {
		width: 100%;
		box-sizing: border-box;
	}
</style>
