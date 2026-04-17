<script>
	import GuidesHero from '$lib/components/guides/GuidesHero.svelte';
	import GuidesFeatured from '$lib/components/guides/GuidesFeatured.svelte';
	import GuidesCategories from '$lib/components/guides/GuidesCategories.svelte';
	import GuidesGrid from '$lib/components/guides/GuidesGrid.svelte';
	import GuidesNewsletterCTA from '$lib/components/guides/GuidesNewsletterCTA.svelte';

	import { featuredGuides, guideCategories, allGuides } from '$lib/components/guides/data.js';
</script>

<svelte:head>
	<title>Guides | DiasporaJunxion</title>
	<meta
		name="description"
		content="Explore guides on relocating to Ghana, family life, belonging, and diaspora opportunity through DiasporaJunxion."
	/>
</svelte:head>

<div class="bg-background text-foreground">
	<GuidesHero />
	<GuidesFeatured items={featuredGuides} />
	<GuidesCategories items={guideCategories} />
	<GuidesGrid items={allGuides} />
	<GuidesNewsletterCTA />
</div>
