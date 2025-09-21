<script>
	import { page } from '$app/stores';
	import Logo from '$lib/Logo.svelte';
</script>

<header class="bg-[#f2b705] p-6 shadow-lg">
	<div class="container mx-auto flex justify-between items-center">
		<Logo />
		<nav class="flex space-x-6">
			<a
				href="/about"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/about'}
			>
				About
			</a>
			<a
				href="/products"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/products'}
			>
				Products
			</a>
			<a
				href="/ndgo"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/ndgo'}
			>
				NDGO
			</a>
			<a
				href="/tours"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/tours'}
			>
				Tours
			</a>
			<a
				href="/team"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/team'}
			>
				Team
			</a>
			<a
				href="/sekondi"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/sekondi'}
			>
				We ❤️ Sekondi
			</a>
			<a
				href="/support"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/support'}
			>
				How to Support
			</a>
			<a
				href="/contact"
				class="relative text-white font-medium transition-colors duration-300 hover:underline"
				class:active={$page.url.pathname === '/contact'}
			>
				Contact Us
			</a>
		</nav>
	</div>
</header>
