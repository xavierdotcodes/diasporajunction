<script>
	import Panel from './Panel.svelte';
	export let orders = [];
	export let active = false;
</script>

<Panel {active}>
	{#each orders as order}
		<div class="p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded shadow mb-2">
			Order #{order.id} — {order.user.name} — {order.status}
		</div>
	{/each}
</Panel>
