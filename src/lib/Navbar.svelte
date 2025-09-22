<script>
	import { page } from '$app/stores';
	import Logo from '$lib/Logo.svelte';

	let menuOpen = false;
</script>

<header class="bg-[#f2b705] p-6 shadow-lg">
	<div class="container mx-auto flex justify-between items-center">
		<Logo />

		<!-- Desktop Nav -->
		<nav class="hidden md:flex space-x-6">
			<a
				href="/about"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/about'}>About</a
			>
			<a
				href="/products"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/products'}>Products</a
			>
			<a
				href="/ndgo"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/ndgo'}>NDGO</a
			>
			<a
				href="/tours"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/tours'}>Tours</a
			>
			<a
				href="/team"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/team'}>Team</a
			>
			<a
				href="/sekondi"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/sekondi'}>We ❤️ Sekondi</a
			>
			<a
				href="/support"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/support'}>How to Support</a
			>
			<a
				href="/contact"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/contact'}>Contact Us</a
			>
		</nav>

		<!-- Mobile Hamburger -->
		<button class="md:hidden text-white focus:outline-none" on:click={() => (menuOpen = !menuOpen)}>
			<!-- Icon -->
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

	<!-- Mobile Slide-out Menu -->
	<div
		class={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#f2b705] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
			menuOpen ? 'translate-x-0' : 'translate-x-full'
		}`}
	>
		<div class="flex justify-end p-6">
			<button class="text-white" on:click={() => (menuOpen = false)}>✕</button>
		</div>
		<nav class="flex flex-col space-y-6 px-6">
			<a
				href="/about"
				class="text-white font-medium hover:underline"
				on:click={() => (menuOpen = false)}>About</a
			>
			<a
				href="/products"
				class="text-white font-medium hover:underline"
				on:click={() => (menuOpen = false)}>Products</a
			>
			<a
				href="/ndgo"
				class="text-white font-medium hover:underline"
				on:click={() => (menuOpen = false)}>NDGO</a
			>
			<a
				href="/tours"
				class="text-white font-medium hover:underline"
				on:click={() => (menuOpen = false)}>Tours</a
			>
			<a
				href="/team"
				class="text-white font-medium hover:underline"
				on:click={() => (menuOpen = false)}>Team</a
			>
			<a
				href="/sekondi"
				class="text-white font-medium hover:underline"
				on:click={() => (menuOpen = false)}>We ❤️ Sekondi</a
			>
			<a
				href="/support"
				class="text-white font-medium hover:underline"
				on:click={() => (menuOpen = false)}>How to Support</a
			>
			<a
				href="/contact"
				class="text-white font-medium hover:underline"
				on:click={() => (menuOpen = false)}>Contact Us</a
			>
		</nav>
	</div>
</header>
