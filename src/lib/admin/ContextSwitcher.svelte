<script>
	export let currentContext;
	export let onSwitch;
</script>

<div class="flex gap-4 justify-center mb-6">
	<button
		class="px-4 py-2 rounded shadow text-white bg-blue-500"
		on:click={() => onSwitch('tours')}
		class:opacity-50={currentContext === 'tours'}
	>
		Tours
	</button>
	<button
		class="px-4 py-2 rounded shadow text-white bg-green-500"
		on:click={() => onSwitch('spaceOrders')}
		class:opacity-50={currentContext === 'spaceOrders'}
	>
		SPACE Orders
	</button>
	<button
		class="px-4 py-2 rounded shadow text-white bg-purple-500"
		on:click={() => onSwitch('ndgoRegs')}
		class:opacity-50={currentContext === 'ndgoRegs'}
	>
		NDGO Registrations
	</button>
</div>
