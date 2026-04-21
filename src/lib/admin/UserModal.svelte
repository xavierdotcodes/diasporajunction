<script>
	import { createEventDispatcher } from 'svelte';
	import { updateCommunityAccess } from '$lib/client/community.js';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/UserModal.svelte');

	let { activeUser, onClose } = $props();
	const dispatch = createEventDispatcher();

	let loading = $state(false);
	let error = $state('');

	async function handleCommunityAccess(action) {
		error = '';
		loading = true;

		try {
			const result = await updateCommunityAccess({
				email: activeUser.email,
				firstName: activeUser.name?.split(' ')?.[0] || '',
				action
			});

			dispatch('communityAccessChanged', {
				userId: activeUser.id,
				email: activeUser.email,
				status: result.grant.status,
				grantedAt: result.grant.grantedAt ?? null
			});
		} catch (submitError) {
			error = submitError.message || 'Failed to update community access.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="user-modal p-4 bg-white shadow-lg rounded-lg w-80">
	<h2 class="font-bold text-lg mb-2">{activeUser.name}</h2>
	<p class="text-sm text-gray-600 mb-2">{activeUser.email}</p>
	<p class="text-sm text-gray-600 mb-2">
		Community access:
		<span class="font-semibold text-gray-900">{activeUser.communityAccessStatus || 'NONE'}</span>
	</p>

	{#if activeUser.registrations?.length > 0}
		<p>NDGO course(s): {activeUser.registrations.length}</p>
	{/if}

	{#if activeUser.reservations?.length > 0}
		<p>Tour(s) booked: {activeUser.reservations.length}</p>
	{/if}

	{#if activeUser.orders?.length > 0}
		<p>Orders: {activeUser.orders.length}</p>
	{/if}

	<div class="mt-4 flex flex-wrap gap-2">
		<button
			type="button"
			class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-60"
			onclick={() => handleCommunityAccess('grant')}
			disabled={loading}
		>
			Grant Community
		</button>
		<button
			type="button"
			class="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-60"
			onclick={() => handleCommunityAccess('revoke')}
			disabled={loading}
		>
			Revoke Community
		</button>
	</div>

	{#if error}
		<p class="mt-3 text-sm text-red-600">{error}</p>
	{/if}

	<button class="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onclick={onClose}>
		Close
	</button>
</div>

<style>
	.user-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 50;
	}
</style>
