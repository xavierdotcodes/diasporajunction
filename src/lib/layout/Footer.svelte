<script>
	import FooterMenu from '$lib/layout/FooterMenu.svelte';
	import SocialLinks from '$lib/layout/SocialLinks.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/layout/Footer.svelte');

	const year = new Date().getFullYear();

	const exploreLinks = [
		{ label: 'Start Here', url: '/start-here' },
		{ label: 'Relocate', url: '/relocate' },
		{ label: 'Guides', url: '/guides' },
		{ label: 'Invest', url: '/invest' },
		{ label: 'Community', url: '/community' },
		{ label: 'Immersion', url: '/immersion' }
	];

	const aboutLinks = [
		{ label: 'About', url: '/about' },
		{ label: 'Founder', url: '/founder' },
		{ label: 'Contact', url: '/contact' }
	];

	const resourceLinks = [{ label: 'Ebook', url: '/ebook' }];

	const legalLinks = [
		{ label: 'Terms of Service', url: '/terms-of-service' },
		{ label: 'Privacy Policy', url: '/privacy-policy' },
		{ label: 'Refund Policy', url: '/refund-policy' }
	];
</script>

<footer class="border-t border-[#2B2B2B] bg-[#0B0B0B] px-4 py-12 text-white">
	<div class="mx-auto max-w-6xl">
		<div class="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr] md:items-start">
			<div class="space-y-4 text-center md:text-left">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.22em] text-[#F2B705]">DiasporaJunxion</p>
					<h2 class="mt-2 text-2xl font-extrabold text-white">Relocate. Connect. Build roots.</h2>
				</div>

				<p class="max-w-md text-sm leading-6 text-white/74">
					A bridge for diaspora people exploring relocation, belonging, community, and long-term
					opportunity in Ghana.
				</p>

				<SocialLinks />
			</div>

			<div class="space-y-6 text-center md:text-left">
				<FooterMenu title="Explore" links={exploreLinks} />
				<FooterMenu title="About" links={aboutLinks} />
			</div>

			<div class="space-y-6 text-center md:text-left">
				<FooterMenu title="Resources" links={resourceLinks} />
				<FooterMenu title="Legal" links={legalLinks} />

				<div class="space-y-2">
					<h3 class="text-xs font-bold uppercase tracking-[0.22em] text-[#F2B705]">Built for</h3>
					<p class="text-sm leading-6 text-white/74">
						Diaspora returners, future movers, families, and people thinking beyond the vacation
						lens.
					</p>
				</div>
			</div>
		</div>

		<Separator class="my-8 bg-white/12" />

		<div
			class="flex flex-col items-center justify-between gap-3 text-center text-sm text-white/62 md:flex-row"
		>
			<p>© {year} DiasporaJunxion. All rights reserved.</p>
			<p>Grounded guidance for moving toward Ghana with more clarity and context.</p>
		</div>
	</div>
</footer>
