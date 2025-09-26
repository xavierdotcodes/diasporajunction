<script>
	import Panel from './Panel.svelte';
	export let regs = [];
	export let active = false;
</script>

<Panel {active}>
	{#each regs as reg}
		<div class="p-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded shadow mb-2">
			{reg.name} — {reg.email}
		</div>
	{/each}
</Panel>
