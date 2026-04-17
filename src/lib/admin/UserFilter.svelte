<script>
	import { createEventDispatcher } from 'svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/UserFilter.svelte');
	const dispatch = createEventDispatcher();

	/**
	 * @typedef {Object} Props
	 * @property {string} [filterType]
	 */

	/** @type {Props} */
	let { filterType = $bindable('all') } = $props();

	function handleChange(e) {
		dispatch('change', e.target.value);
	}
</script>

<div class="user-filter flex items-center gap-3 mb-4 sm:mb-6 justify-center">
	<label for="user-filter" class="font-semibold text-gray-700 whitespace-nowrap">Show:</label>
	<select
		id="user-filter"
		bind:value={filterType}
		onchange={handleChange}
		class="px-4 py-1 rounded-full border border-gray-300 bg-white text-gray-800 text-sm font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all w-auto min-w-[140px]"
	>
		<option value="all">All Users</option>
		<option value="subscribers">Subscribers</option>
		<option value="ndgo">NDGO</option>
		<option value="tourees">Tourees</option>
		<option value="customers">Customers</option>
	</select>
</div>

<style>
	.user-filter select {
		cursor: pointer;
		appearance: none; /* remove default arrow styling */
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='gray' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
		background-size: 1em;
	}
</style>
