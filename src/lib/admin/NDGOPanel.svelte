<script>
	export let registrations = [];
</script>

{#each registrations as reg}
	<div class="p-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded shadow mb-2">
		{reg.name} — {reg.email}
	</div>
{/each}
