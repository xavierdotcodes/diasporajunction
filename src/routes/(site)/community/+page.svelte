<script>
	import CommunityHero from '$lib/components/community/CommunityHero.svelte';
	import CommunityWays from '$lib/components/community/CommunityWays.svelte';
	import CommunityExperiences from '$lib/components/community/CommunityExperiences.svelte';
	import CommunityPrinciples from '$lib/components/community/CommunityPrinciples.svelte';
	import CommunityCTA from '$lib/components/community/CommunityCTA.svelte';

	import {
		communityWays,
		communityExperiences,
		communityPrinciples
	} from '$lib/components/community/data.js';
</script>

<svelte:head>
	<title>Community | DiasporaJunxion</title>
	<meta
		name="description"
		content="Explore community, connection, culture, and belonging in Ghana through DiasporaJunxion."
	/>
</svelte:head>

<div class="bg-background text-foreground">
	<CommunityHero />
	<CommunityWays items={communityWays} />
	<CommunityExperiences items={communityExperiences} />
	<CommunityPrinciples items={communityPrinciples} />
	<CommunityCTA />
</div>
