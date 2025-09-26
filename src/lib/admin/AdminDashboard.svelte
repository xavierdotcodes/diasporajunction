<script>
	import { fly, fade } from 'svelte/transition';
	import ContextSwitcher from './ContextSwitcher.svelte';
	import ToursPanel from './ToursPanel.svelte';
	import SpaceOrdersPanel from './SpaceOrdersPanel.svelte';
	import NdgoRegsPanel from './NdgoRegsPanel.svelte';
	import LogoutButton from '$lib/layout/LogoutButton.svelte';

	export let tours = [];
	export let spaceOrders = [];
	export let ndgoRegs = [];

	let currentContext = 'tours';

	const switchContext = (context) => {
		currentContext = context;
	};
</script>

<div class="min-h-screen bg-gray-50 flex flex-col p-4 md:p-6">
	<!-- Header -->
	<div class="flex justify-between items-center mb-4 md:mb-6">
		<LogoutButton />
	</div>

	<!-- Context Switcher -->
	<ContextSwitcher {currentContext} onSwitch={switchContext} class="mb-4 md:mb-6" />

	<!-- Panels -->
	<div class="flex-1 flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
		{#if currentContext === 'tours'}
			<div in:fade={{ duration: 300 }} out:fade={{ duration: 200 }} class="flex-1">
				<ToursPanel {tours} />
			</div>
		{:else if currentContext === 'spaceOrders'}
			<div in:fade={{ duration: 300 }} out:fade={{ duration: 200 }} class="flex-1">
				<SpaceOrdersPanel orders={spaceOrders} />
			</div>
		{:else if currentContext === 'ndgoRegs'}
			<div in:fade={{ duration: 300 }} out:fade={{ duration: 200 }} class="flex-1">
				<NdgoRegsPanel regs={ndgoRegs} />
			</div>
		{/if}
	</div>
</div>

<style>
	/* Scrollable cards for overflow */
	.panel {
		overflow-y: auto;
		max-height: 70vh;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.panel {
			max-height: 60vh;
		}
	}
</style>
