<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/ContextSwitcher.svelte');

	let { currentContext = $bindable(), onSwitch } = $props();

	let open = $state(false);

	const contexts = [
		{ id: 'tours', label: 'Tours', color: 'from-yellow-400 to-yellow-500' },
		{ id: 'orders', label: 'Orders', color: 'from-green-700 to-green-800' },
		{ id: 'ndgo', label: 'NDGO', color: 'from-gray-600 to-gray-700' },
		{ id: 'users', label: 'Users', color: 'from-red-700 to-red-800' }
	];

	function selectContext(id) {
		onSwitch(id);
		currentContext = id;
		open = false;
	}
</script>

<!-- Desktop buttons -->
<div class="hidden sm:flex flex-wrap justify-center gap-4 mb-6">
	{#each contexts as context}
		<button
			class={`px-6 py-2 rounded-full text-white font-semibold shadow-md bg-gradient-to-r ${context.color}
				transition-all duration-200 transform
				${currentContext === context.id ? 'scale-105 shadow-xl' : 'opacity-80 hover:scale-105 hover:shadow-lg'}`}
			onclick={() => selectContext(context.id)}
		>
			{context.label}
		</button>
	{/each}
</div>

<!-- Mobile/tablet custom dropdown -->
<div class="sm:hidden relative mb-6">
	<!-- Trigger button -->
	<button
		class="w-full p-3 rounded-full bg-gray-800 text-white font-semibold shadow-md flex justify-between items-center"
		onclick={() => (open = !open)}
	>
		{contexts.find((c) => c.id === currentContext)?.label}
		<span class="ml-2 transition-transform duration-200" class:rotate-180={open}> ▼ </span>
	</button>

	{#if open}
		<div class="absolute z-50 w-full mt-2 bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
			{#each contexts as context, i}
				<button
					class={`w-full text-left px-5 py-4 text-white font-semibold bg-gradient-to-r ${context.color} 
						transition-all duration-200 transform
						${currentContext === context.id ? 'scale-105 shadow-lg' : 'opacity-90 hover:scale-105 hover:shadow-md'}`}
					onclick={() => selectContext(context.id)}
					style="border-bottom: {i !== contexts.length - 1
						? '1px solid rgba(255,255,255,0.1)'
						: 'none'};"
				>
					{context.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.rotate-180 {
		transform: rotate(180deg);
	}

	button {
		cursor: pointer;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		text-align: center;
	}

	button:focus {
		outline: none;
		box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.3); /* subtle yellow glow */
	}
</style>
