<script>
	import { page } from '$app/stores';
	import Logo from '$lib/layout/Logo.svelte';
	import { onMount } from 'svelte';

	let menuOpen = false;
	let canAccessDOM = false;

	const links = [
		{ href: '/approach', label: 'Our Approach' },
		{ href: '/space', label: 'SP△CE' },
		{ href: '/ndgo', label: 'NDGO' },
		{ href: '/diasporaunited', label: 'Diaspora United' },
		{ href: '/tours', label: 'Tours' },
		{ href: '/team', label: 'Team' },

		{ href: '/sekondi', label: 'We ❤️ Sekondi' },
		{ href: '/support', label: 'How to Support' },
		{ href: '/contact', label: 'Contact Us' }
	];

	onMount(() => (canAccessDOM = true));

	function closeMenu() {
		menuOpen = false;
		if (canAccessDOM) document.body.style.overflow = '';
	}

	$: if (canAccessDOM) {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
	}
</script>

<header class="relative z-50 overflow-x-hidden">
	<!-- Desktop & Tablet Header -->
	<div
		class="desktop-header hidden lg:flex bg-[#f2b705] p-4 lg:p-6 shadow-lg justify-between items-center w-full"
	>
		<Logo />
		<nav class="flex space-x-6">
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
	</div>

	<!-- Mobile Hamburger -->
	<button
		class="hamburger fixed top-3 right-3 z-[100] text-white bg-black/60 backdrop-blur-md rounded-xl p-2 focus:outline-none"
		on:click={() => (menuOpen = !menuOpen)}
		aria-label="Toggle Menu"
	>
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

	<!-- Overlay -->
	{#if menuOpen}
		<div class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" on:click={closeMenu}></div>
	{/if}

	<!-- Mobile Slide-out Menu -->
	<div
		class={`mobile-menu fixed top-0 right-0 h-full bg-[#f2b705] shadow-xl transform transition-transform duration-300 ease-in-out z-50
			${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
		style="width: 100vw; max-width: 360px;"
	>
		<!-- Menu Header -->
		<div class="flex justify-center items-center px-6 py-5 border-b border-white/20">
			<Logo small />
		</div>

		<!-- Scrollable Menu Content -->
		<nav
			class="flex flex-col px-6 py-6 space-y-5 overflow-y-auto max-h-[calc(100vh-80px)] touch-pan-y"
		>
			{#each links as link}
				<a
					href={link.href}
					class="block text-lg font-medium transition-colors duration-300 hover:[color:#008e30] whitespace-nowrap"
					class:text-red-500={$page.url.pathname === link.href}
					class:text-white={$page.url.pathname !== link.href}
					on:click={closeMenu}
				>
					{link.label}
				</a>
			{/each}

			<div class="pt-10 text-sm text-white/80 border-t border-white/20 mt-auto">
				<p>© {new Date().getFullYear()} DiasporaJunxion</p>
			</div>
		</nav>
	</div>
</header>

<style>
	/* ---- Global scroll fix ---- */
	html,
	body {
		overflow-x: hidden !important;
		margin: 0;
		padding: 0;
	}

	/* ---- Mobile (any orientation, up to tablet width) ---- */
	@media (max-width: 1023px) {
		.desktop-header {
			display: none !important;
		}

		.hamburger {
			display: flex !important;
			position: fixed;
			top: 0.75rem;
			right: 0.75rem;
			z-index: 100;
			background: rgba(0, 0, 0, 0.6);
			backdrop-filter: blur(8px);
			color: white;
			padding: 0.5rem;
			border-radius: 0.75rem;
			line-height: 0;
		}
	}

	/* Landscape-specific adjustments */
	@media (max-width: 1023px) and (orientation: landscape) {
		.hamburger {
			top: 0.5rem;
			right: 0.5rem;
		}
	}

	/* Hide hamburger on larger viewports */
	@media (min-width: 1024px) {
		.hamburger {
			display: none !important;
		}
	}

	/* Scrollbar styling for slide-out menu */
	.mobile-menu nav::-webkit-scrollbar {
		width: 6px;
	}
	.mobile-menu nav::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
	}
</style>
