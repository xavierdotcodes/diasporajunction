<script>
	export let currentContext;
	export let onSwitch;

	const contexts = [
		{ id: 'tours', label: 'Tours', color: 'from-yellow-400 to-yellow-500' },
		{ id: 'orders', label: 'Orders', color: 'from-green-700 to-green-800' },
		{ id: 'ndgo', label: 'NDGO', color: 'from-gray-600 to-gray-700' },
		{ id: 'users', label: 'Users', color: 'from-red-700 to-red-800' }
	];
</script>

<!-- Desktop -->
<div class="hidden sm:flex flex-wrap justify-center gap-4 mb-6">
	{#each contexts as context}
		<button
			class={`px-6 py-2 rounded-full text-white font-semibold shadow-md bg-gradient-to-r ${context.color} 
				transition-all duration-200 transform
				${currentContext === context.id ? 'scale-105 shadow-xl' : 'opacity-80 hover:scale-105 hover:shadow-lg'}`}
			on:click={() => onSwitch(context.id)}
		>
			{context.label}
		</button>
	{/each}
</div>

<!-- Mobile -->
<div class="sm:hidden flex flex-col gap-3 mb-6">
	{#each contexts as context}
		<button
			class={`w-full py-3 rounded-full text-white font-semibold shadow-md bg-gradient-to-r ${context.color}
				transition-all duration-200 transform
				${currentContext === context.id ? 'scale-105 shadow-lg' : 'opacity-80 hover:scale-105 hover:shadow-md'}`}
			on:click={() => onSwitch(context.id)}
		>
			{context.label}
		</button>
	{/each}
</div>

<style>
	button {
		cursor: pointer;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}
	button:focus {
		outline: none;
		box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.3); /* subtle yellow glow */
	}
</style>
