<script>
	import { page } from '$app/stores';
	import Logo from '$lib/layout/Logo.svelte';

	let menuOpen = false;

	const links = [
		{ href: '/about', label: 'About' },
		{ href: '/space', label: 'SP△CE' },
		{ href: '/ndgo', label: 'NDGO' },
		{ href: '/tours', label: 'Tours' },
		{ href: '/team', label: 'Team' },
		{ href: '/sekondi', label: 'We ❤️ Sekondi' },
		{ href: '/support', label: 'How to Support' },
		{ href: '/contact', label: 'Contact Us' }
	];

	function closeMenu() {
		menuOpen = false;
	}
</script>

<header class="bg-[#f2b705] p-6 shadow-lg relative z-50">
	<div class="container mx-auto flex justify-between items-center">
		<Logo />

		<!-- Desktop Nav -->
		<nav class="hidden md:flex space-x-6">
			{#each links as link}
				<a
					href={link.href}
					class="relative font-medium transition-colors duration-300 hover:[color:#008e30]"
					class:text-red-500={$page.url.pathname === link.href}
					class:text-white={$page.url.pathname !== link.href}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Mobile Hamburger -->
		<button class="md:hidden text-white focus:outline-none" on:click={() => (menuOpen = !menuOpen)}>
			<svg
				class="w-8 h-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
				></path>
			</svg>
		</button>
	</div>

	<!-- Mobile Slide-out Menu Overlay -->
	{#if menuOpen}
		<div class="fixed inset-0 z-40" on:click={closeMenu}></div>
	{/if}

	<!-- Mobile Slide-out Menu -->
	<div
		class={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#f2b705] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
			menuOpen ? 'translate-x-0' : 'translate-x-full'
		}`}
	>
		<div class="flex justify-end p-6">
			<button class="text-white" on:click={closeMenu}>✕</button>
		</div>
		<nav class="flex flex-col space-y-6 px-6">
			{#each links as link}
				<a
					href={link.href}
					class="font-medium transition-colors duration-300 hover:[color:#008e30]"
					class:text-red-500={$page.url.pathname === link.href}
					class:text-white={$page.url.pathname !== link.href}
					on:click={closeMenu}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</div>
</header>
