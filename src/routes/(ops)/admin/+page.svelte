<script>
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import ContextSwitcher from '$lib/admin/ContextSwitcher.svelte';
	import ToursPanel from '$lib/admin/ToursPanel.svelte';
	import OrdersPanel from '$lib/admin/OrdersPanel.svelte';
	import NDGOPanel from '$lib/admin/NDGOPanel.svelte';
	import UsersPanel from '$lib/admin/UsersPanel.svelte';
	import UserFilter from '$lib/admin/UserFilter.svelte';
	import LogoutButton from '$lib/layout/LogoutButton.svelte';
	import AddTourModal from '$lib/admin/AddTourModal.svelte';
	import AnimatedPanel from '$lib/admin/AnimatedPanel.svelte';
	import UserModal from '$lib/admin/UserModal.svelte';
	import { addTour } from '$lib/client/admin.js';
	import { fileLogger } from '$lib/utils/logger';

	const log = fileLogger('src/routes/(ops)/admin/+page.svelte');

	let { data } = $props();
	let tours = $state([]);
	let users = $state([]);
	let orders = $derived.by(() => data.orders);
	let registrations = $derived.by(() => data.registrations);
	let bookings = $derived.by(() => data.bookings);

	$effect(() => {
		tours = data.tours;
		users = data.users;
	});

	let currentContext = $state('tours');
	let showAddTour = $state(false);
	let userFilterType = $state('all');

	let activeUser = $state(null);
	let modalWrapper = $state();

	const switchContext = (context) => (currentContext = context);

	function handleTourAdded(newTour) {
		tours = [...tours, newTour];
	}

	function handleTourDelete(id) {
		tours = tours.filter((t) => t.id !== id);
	}

	function handleSubscriberDelete(id) {
		users = users.map((u) => (u.id === id ? { ...u, subscribed: false } : u));
	}

	function handleUserFilterChange(value) {
		userFilterType = value;
	}

	async function handleOpenUserModal(user) {
		log.info({
			phase: 'admin_user_modal_open_requested',
			userId: user?.id
		});
		activeUser = user;
		await tick();
		gsap.fromTo(
			modalWrapper,
			{ autoAlpha: 0, scale: 0.9 },
			{ duration: 0.3, autoAlpha: 1, scale: 1, ease: 'power2.out' }
		);
	}

	function handleCloseUserModal() {
		if (!modalWrapper) return;
		log.info({ phase: 'admin_user_modal_close_requested', userId: activeUser?.id });
		gsap.to(modalWrapper, {
			duration: 0.2,
			autoAlpha: 0,
			scale: 0.9,
			ease: 'power2.in',
			onComplete: () => (activeUser = null)
		});
	}

	function handleCommunityAccessChanged({ detail }) {
		users = users.map((user) =>
			user.id === detail.userId
				? {
						...user,
						communityAccessStatus: detail.status,
						communityAccessGrantedAt: detail.grantedAt
					}
				: user
		);

		if (activeUser?.id === detail.userId) {
			activeUser = {
				...activeUser,
				communityAccessStatus: detail.status,
				communityAccessGrantedAt: detail.grantedAt
			};
		}
	}

	onMount(() => {
		log.info({
			phase: 'admin_dashboard_mounted',
			tourCount: tours.length,
			userCount: users.length
		});
	});
</script>

<main class="min-h-screen bg-gray-50 flex flex-col gap-6 p-4 md:p-6 items-center relative w-full">
	<h1 class="text-4xl font-bold text-center">Admin Dashboard</h1>

	<!-- Toolbar row: UserFilter (for users only) -->
	<div
		class="flex flex-col md:flex-row justify-end items-start md:items-center w-full max-w-6xl gap-2"
	>
		{#if currentContext === 'users'}
			<UserFilter
				bind:filterType={userFilterType}
				on:change={(e) => handleUserFilterChange(e.detail)}
			/>
		{/if}
	</div>

	<!-- ContextSwitcher -->
	<ContextSwitcher
		{currentContext}
		onSwitch={switchContext}
		class="mb-4 md:mb-6 w-full max-w-6xl mx-auto"
		options={['tours', 'orders', 'ndgo', 'users']}
	/>

	<!-- Panels -->
	<div class="flex-1 w-full max-w-6xl relative h-full">
		<AnimatedPanel active={currentContext === 'tours'}>
			<ToursPanel {tours} on:remove={handleTourDelete} />
		</AnimatedPanel>

		<AnimatedPanel active={currentContext === 'orders'}>
			<OrdersPanel {orders} />
		</AnimatedPanel>

		<AnimatedPanel active={currentContext === 'ndgo'}>
			<NDGOPanel {registrations} />
		</AnimatedPanel>

		<AnimatedPanel active={currentContext === 'users'}>
			<UsersPanel
				{users}
				filterType={userFilterType}
				on:unsubscribe={handleSubscriberDelete}
				on:openModal={(e) => handleOpenUserModal(e.detail)}
			/>
		</AnimatedPanel>
	</div>

	<!-- Modals -->
	<AddTourModal
		open={showAddTour}
		onClose={() => (showAddTour = false)}
		onTourAdded={handleTourAdded}
	/>

	{#if activeUser}
		<div bind:this={modalWrapper} class="absolute z-50 top-20 left-1/2 transform -translate-x-1/2">
			<UserModal
				{activeUser}
				onClose={handleCloseUserModal}
				on:communityAccessChanged={handleCommunityAccessChanged}
			/>
		</div>
	{/if}
</main>

<!-- Floating Buttons -->
<!-- Logout: bottom-left -->
<div class="fixed bottom-6 left-6 z-50">
	<LogoutButton
		class="shadow-xl rounded-full bg-white p-3 hover:bg-gray-100 transition-transform transform hover:scale-105"
	/>
</div>

<!-- Add Tour: bottom-right -->
{#if currentContext === 'tours'}
	<div class="fixed bottom-6 right-6 z-50">
		<button
			onclick={() => (showAddTour = true)}
			class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full shadow-xl transition-transform transform hover:scale-105"
		>
			➕ Add Tour
		</button>
	</div>
{/if}

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: linear-gradient(to right, #f0f4f8, #d9e2ec);
	}

	/* Optional: floating buttons shadows */
	.fixed button,
	.fixed :global(button) {
		cursor: pointer;
	}
</style>
