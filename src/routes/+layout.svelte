<script>
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Navbar from '$lib/components/layout/Nav.svelte';
	import {
		initPostHog,
		capturePageview,
		identifyPostHogUser,
		resetPostHogUser
	} from '$lib/client/analytics';
	import LeadCaptureModal from '$lib/components/lead/LeadCaptureModal.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import { persistLeadAttribution } from '$lib/lead/attribution';
	import { autoReveal } from '$lib/motion/reveal';
	import { pageFade } from '$lib/motion/transitions';
	import '../app.css';
	import { fileLogger } from '$lib/utils/logger';
	import { onMount } from 'svelte';
	/**
	 * @typedef {Object} Props
	 * @property {{ user?: { id: string, email?: string | null, name?: string | null, subscribed?: boolean, roles?: string[] } | null }} [data]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children, data } = $props();
	let skipInitialAfterNavigate = true;

	fileLogger('src/routes/+layout.svelte');

	if (browser) {
		afterNavigate(({ to }) => {
			if (skipInitialAfterNavigate) {
				skipInitialAfterNavigate = false;
			} else {
				capturePageview(to?.url ?? window.location);
			}

			persistLeadAttribution(to?.url ?? window.location);
		});
	}

	onMount(() => {
		persistLeadAttribution(window.location);

		if (!initPostHog()) return;

		if (data?.user?.id) {
			identifyPostHogUser(data.user.id, {
				email: data.user.email ?? undefined,
				name: data.user.name ?? undefined,
				roles: data.user.roles ?? []
			});
		} else {
			resetPostHogUser();
		}

		capturePageview(window.location);
	});
</script>

<svelte:head>
	<title>DiasporaJunxion – Connecting the Diaspora</title>

	<!-- Open Graph / WhatsApp / Facebook -->
	<meta property="og:title" content="DiasporaJunxion – Connecting the Diaspora" />
	<meta
		property="og:description"
		content="Discover opportunities, events, and networks tailored for the African diaspora. Build connections, grow, and thrive globally."
	/>
	<meta property="og:image" content="https://diasporajunxion.com/logo2.png" />
	<meta property="og:url" content="https://diasporajunxion.com" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />

	<!-- Optional: Facebook App ID -->
	<meta property="fb:app_id" content="YOUR_FB_APP_ID" />

	<!-- Twitter fallback -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="DiasporaJunxion – Connecting the Diaspora" />
	<meta
		name="twitter:description"
		content="Discover opportunities, events, and networks tailored for the African diaspora. Build connections, grow, and thrive globally."
	/>
	<meta name="twitter:image" content="https://diasporajunxion.com/logo2.png" />

	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="DiasporaJunxion" />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="preload" as="video" href="/videos/tours-hero.mp4" type="video/mp4" />
	<script
		defer
		src="https://cloud.umami.is/script.js"
		data-website-id="b4bcbb63-1d88-41da-8000-cfc37f06b1ba"
	></script>
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Navbar />

	<main class="flex-1 overflow-x-clip">
		{#key page.url.pathname}
			<div
				use:autoReveal
				in:pageFade={{ duration: 440, y: 24, blur: 10 }}
				out:pageFade={{ duration: 300, y: 10, blur: 6, outro: true }}
				class="route-shell relative will-change-[opacity,transform,filter]"
			>
				{@render children?.()}
			</div>
		{/key}
	</main>

	<Footer />
	<LeadCaptureModal />
</div>
