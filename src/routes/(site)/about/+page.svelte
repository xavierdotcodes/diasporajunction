<script>
	import AboutHero from '$lib/components/about/AboutHero.svelte';
	import AboutWhat from '$lib/components/about/AboutWhat.svelte';
	import AboutWhy from '$lib/components/about/AboutWhy.svelte';
	import AboutBridge from '$lib/components/about/AboutBridge.svelte';
	import AboutVision from '$lib/components/about/AboutVision.svelte';
	import AboutFounder from '$lib/components/about/AboutFounder.svelte';
	import AboutCTA from '$lib/components/about/AboutCTA.svelte';

	import { aboutWhat, aboutWhy, aboutBridge, aboutVision } from '$lib/components/about/data.js';
</script>

<svelte:head>
	<title>About | DiasporaJunxion</title>
	<meta
		name="description"
		content="Learn what DiasporaJunxion is building at the intersection of diaspora relocation, belonging, and African opportunity."
	/>
</svelte:head>

<div class="bg-background text-foreground">
	<AboutHero />
	<AboutWhat items={aboutWhat} />
	<AboutWhy items={aboutWhy} />
	<AboutBridge items={aboutBridge} />
	<AboutVision items={aboutVision} />
	<AboutFounder />
	<AboutCTA />
</div>
