<script>
	import StartHereHero from '$lib/components/start-here/StartHereHero.svelte';
	import StartHereTruths from '$lib/components/start-here/StartHereTruths.svelte';
	import StartHereQuestions from '$lib/components/start-here/StartHereQuestions.svelte';
	import StartHerePaths from '$lib/components/start-here/StartHerePaths.svelte';
	import StartHereResource from '$lib/components/start-here/StartHereResource.svelte';
	import StartHereCTA from '$lib/components/start-here/StartHereCTA.svelte';
	import LeadCaptureInline from '$lib/components/lead/LeadCaptureInline.svelte';

	import {
		startHereTruths,
		startHereQuestions,
		startHerePaths,
		featuredResource
	} from '$lib/components/start-here/data.js';
	import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
</script>

<svelte:head>
	<title>Start Here | DiasporaJunxion</title>
	<meta
		name="description"
		content="Start your Ghana relocation journey with grounded guidance, key questions, and clear next steps through DiasporaJunxion."
	/>
</svelte:head>

<div class="bg-background text-foreground">
	<StartHereHero />
	<StartHereTruths items={startHereTruths} />
	<StartHereQuestions items={startHereQuestions} />
	<StartHerePaths items={startHerePaths} />
	<div class="mx-auto max-w-5xl px-6 py-10 md:px-10">
		<LeadCaptureInline
			title="Thinking about moving to Ghana?"
			description={`Get the free guide: ${DEFAULT_LEAD_MAGNET_NAME}`}
			buttonText="Send Me the Guide"
			source="start_here_page"
			leadMagnet={DEFAULT_LEAD_MAGNET_NAME}
			entryPage="/start-here"
		/>
	</div>
	<StartHereResource resource={featuredResource} />
	<StartHereCTA />
</div>
