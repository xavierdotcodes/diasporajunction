<script>
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Navbar from '$lib/components/layout/Nav.svelte';
	import {
		initPostHog,
		capturePageview,
		initializeEngagementTracking,
		identifyPostHogUser,
		resetPostHogUser
	} from '$lib/client/analytics';
	import LeadCaptureModal from '$lib/components/lead/LeadCaptureModal.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import { persistLeadAttribution } from '$lib/lead/attribution';
	import { autoReveal } from '$lib/motion/reveal';
	import { pageFade } from '$lib/motion/transitions';
	import { resolvePageSeo, serializeJsonLd } from '$lib/seo';
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
	let currentPostHogUserId = $state(null);
	const seo = $derived(
		resolvePageSeo({
			pathname: page.url.pathname,
			data: page.data ?? {},
			status: page.status ?? 200
		})
	);

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
		initializeEngagementTracking();
		if (data?.user?.id) {
			currentPostHogUserId = data.user.id;
			identifyPostHogUser(data.user.id, {
				authenticated: true,
				subscribed: Boolean(data.user.subscribed),
				roles: data.user.roles ?? []
			});
		}
		capturePageview(window.location);
	});

	$effect(() => {
		if (!browser) return;

		const user = data?.user;
		if (user?.id && currentPostHogUserId !== user.id) {
			currentPostHogUserId = user.id;
			identifyPostHogUser(user.id, {
				authenticated: true,
				subscribed: Boolean(user.subscribed),
				roles: user.roles ?? []
			});
		} else if (!user?.id && currentPostHogUserId) {
			currentPostHogUserId = null;
			resetPostHogUser();
		}
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="robots" content={seo.robots} />
	<link rel="canonical" href={seo.canonical} />

	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:image" content={seo.image} />
	<meta property="og:url" content={seo.canonical} />
	<meta property="og:type" content={seo.type} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content={seo.siteName} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.image} />
	{#each seo.structuredData as schema}
		<script type="application/ld+json">
			{@html serializeJsonLd(schema)}
		</script>
	{/each}

	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="DiasporaJunxion" />
	<link rel="manifest" href="/site.webmanifest" />
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
