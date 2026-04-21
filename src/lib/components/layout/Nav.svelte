<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Logo from '$lib/components/shared/Logo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { panelSlide, veilFade } from '$lib/motion/transitions';
	import { fileLogger } from '$lib/utils/logger';
	import { siteNavLinks, siteNavCta } from '$lib/components/layout/nav';

	fileLogger('src/lib/components/layout/Nav.svelte');

	let menuOpen = $state(false);
	let menuButton = $state();

	function isActiveLink(href) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}

	function closeMenu() {
		menuOpen = false;
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function handleOverlayKeydown(event) {
		if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			closeMenu();
		}
	}

	onMount(() => {
		afterNavigate(() => {
			closeMenu();
		});
	});

	$effect(() => {
		if (typeof document === 'undefined') return;

		document.body.style.overflow = menuOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		if (!menuOpen && menuButton) {
			menuButton.focus();
		}
	});

	$effect(() => {
		if (typeof window === 'undefined' || !menuOpen) return;

		const handleKeydown = (event) => {
			if (event.key === 'Escape') {
				closeMenu();
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<header
	class="sticky top-0 z-[70] border-b border-[#C98E00]/20 bg-[#F2B705]/96 text-[#111111] backdrop-blur supports-[backdrop-filter]:bg-[#F2B705]/92 shadow-[0_10px_30px_rgba(11,11,11,0.08)]"
>
	<div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
		<div class="flex items-center gap-4">
			<Logo />
		</div>

		<div class="min-w-0 flex-1 px-2 text-center lg:px-0">
			<p
				class="text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.22em] text-black/58 sm:text-[0.7rem] lg:text-xs lg:tracking-[0.3em]"
			>
				Relocation. Belonging. Opportunity.
			</p>
		</div>

		<nav class="hidden items-center gap-2 lg:flex">
			{#each siteNavLinks as link}
				<Button
					href={link.href}
					variant="ghost"
					size="sm"
					className={`${
						isActiveLink(link.href)
							? 'bg-[#D9042B] text-white shadow-[0_12px_24px_rgba(95,0,18,0.18)] hover:bg-[#B10323] hover:text-white focus-visible:ring-[#D9042B]'
							: 'text-[#111111] hover:bg-white/55'
					}`}
				>
					<span>{link.label}</span>
				</Button>
			{/each}
		</nav>

		<div class="hidden lg:block">
			<Button href={siteNavCta.href} variant="brand" size="sm">{siteNavCta.label}</Button>
		</div>

		<button
			bind:this={menuButton}
			type="button"
			class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-white/88 text-[#111111] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#038C25] focus-visible:ring-offset-2 lg:hidden"
			onclick={toggleMenu}
			aria-label="Toggle navigation menu"
			aria-expanded={menuOpen}
			aria-controls="mobile-site-navigation"
		>
			<span class="sr-only">Toggle navigation menu</span>
			{#if menuOpen}
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			{:else}
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
			{/if}
		</button>
	</div>
</header>

{#if menuOpen}
	<div class="fixed inset-0 z-[120] lg:hidden" aria-hidden={!menuOpen}>
		<div
			in:veilFade={{ duration: 240 }}
			out:fade={{ duration: 180 }}
			class="absolute inset-0 bg-black/58 backdrop-blur-sm"
			role="button"
			tabindex="0"
			aria-label="Close navigation menu"
			onclick={closeMenu}
			onkeydown={handleOverlayKeydown}
		></div>

		<div
			id="mobile-site-navigation"
			in:panelSlide={{ duration: 340, x: 20, blur: 8 }}
			out:panelSlide={{ duration: 240, x: 12, blur: 4 }}
			class="absolute inset-y-0 right-0 flex h-full w-[min(24rem,100vw)] flex-col border-l border-[#C98E00]/20 bg-[#F2B705] shadow-[0_24px_70px_rgba(11,11,11,0.34)]"
			role="dialog"
			aria-modal="true"
			aria-label="Navigation"
		>
			<div class="border-b border-black/10 px-5 py-4">
				<div class="flex items-center justify-between gap-4">
					<h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-[#111111]">
						Navigation
					</h2>
					<button
						type="button"
						class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B] text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[0.98] hover:bg-[#171717]"
						aria-label="Close navigation menu"
						onclick={closeMenu}
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>
				<p class="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/60">
					Relocation. Belonging. Opportunity.
				</p>
			</div>

			<div class="min-h-0 flex-1 overflow-y-auto px-5 py-6">
				<nav class="flex flex-col gap-3" aria-label="Mobile navigation">
					{#each siteNavLinks as link}
						<a
							href={link.href}
							class={`inline-flex w-full items-center justify-start rounded-[1.4rem] px-4 py-3 text-base font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#038C25] focus-visible:ring-offset-2 ${
								isActiveLink(link.href)
									? 'bg-[#D9042B] text-white shadow-[0_18px_40px_rgba(95,0,18,0.18)]'
									: 'border border-black/10 bg-white/92 text-[#111111] hover:-translate-y-[1px] hover:bg-white'
							}`}
							onclick={closeMenu}
						>
							{link.label}
						</a>
					{/each}
				</nav>

				<div class="mt-8 border-t border-black/10 pt-6">
					<a
						href={siteNavCta.href}
						class="inline-flex w-full items-center justify-center rounded-full bg-[#038C25] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:bg-[#026B1D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#038C25] focus-visible:ring-offset-2"
						onclick={closeMenu}
					>
						{siteNavCta.label}
					</a>
					<p class="mt-6 text-xs uppercase tracking-[0.25em] text-black/60">
						© {new Date().getFullYear()} DiasporaJunxion
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}
