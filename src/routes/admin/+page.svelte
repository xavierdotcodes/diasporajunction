<script>
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import ContextSwitcher from '$lib/admin/ContextSwitcher.svelte';
	import ToursPanel from '$lib/admin/ToursPanel.svelte';
	import OrdersPanel from '$lib/admin/OrdersPanel.svelte';
	import NDGOPanel from '$lib/admin/NDGOPanel.svelte';
	import UsersPanel from '$lib/admin/UsersPanel.svelte';
	import LogoutButton from '$lib/layout/LogoutButton.svelte';
	import AddTourModal from '$lib/admin/AddTourModal.svelte';
	import AnimatedPanel from '$lib/admin/AnimatedPanel.svelte';
	import UserModal from '$lib/admin/UserModal.svelte';
	import { addTour } from '$lib/client/helpers.js';

	export let data;
	let { tours, orders, registrations, bookings, users } = data;

	let currentContext = 'tours';
	let showAddTour = false;

	let activeUser = null;
	let modalWrapper;

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

	async function handleOpenUserModal(user) {
		activeUser = user;
		await tick(); // wait for modalWrapper to be in the DOM
		gsap.fromTo(
			modalWrapper,
			{ autoAlpha: 0, scale: 0.9 },
			{ duration: 0.3, autoAlpha: 1, scale: 1, ease: 'power2.out' }
		);
	}

	function handleCloseUserModal() {
		if (!modalWrapper) return;
		gsap.to(modalWrapper, {
			duration: 0.2,
			autoAlpha: 0,
			scale: 0.9,
			ease: 'power2.in',
			onComplete: () => (activeUser = null)
		});
	}

	onMount(() => console.log('Admin dashboard mounted'));
</script>

<main class="min-h-screen bg-gray-50 flex flex-col p-4 md:p-6 relative w-full">
	<h1 class="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2 md:gap-0 w-full max-w-6xl mx-auto"
	>
		<LogoutButton />
		{#if currentContext === 'tours'}
			<button
				on:click={() => (showAddTour = true)}
				class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg shadow transition-transform transform hover:scale-105"
			>
				➕ Add Tour
			</button>
		{/if}
	</div>

	<ContextSwitcher
		{currentContext}
		onSwitch={switchContext}
		class="mb-4 md:mb-6 w-full max-w-6xl mx-auto"
		options={['tours', 'orders', 'ndgo', 'users']}
	/>

	<div class="flex-1 w-full max-w-6xl mx-auto relative">
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
				on:unsubscribe={handleSubscriberDelete}
				on:openModal={(e) => handleOpenUserModal(e.detail)}
			/>
		</AnimatedPanel>
	</div>

	<AddTourModal
		open={showAddTour}
		onClose={() => (showAddTour = false)}
		onTourAdded={handleTourAdded}
	/>

	{#if activeUser}
		<div bind:this={modalWrapper} class="absolute z-50 top-20 left-1/2 transform -translate-x-1/2">
			<UserModal {activeUser} onClose={handleCloseUserModal} />
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: linear-gradient(to right, #f0f4f8, #d9e2ec);
	}
</style>
