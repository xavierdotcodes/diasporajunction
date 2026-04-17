<script>
	import RelocateHero from '$lib/components/relocate/RelocateHero.svelte';
	import RelocateQuickLinks from '$lib/components/relocate/RelocateQuickLinks.svelte';
	import RelocateSteps from '$lib/components/relocate/RelocateSteps.svelte';
	import RelocateFAQ from '$lib/components/relocate/RelocateFAQ.svelte';
	import RelocateCTA from '$lib/components/relocate/RelocateCTA.svelte';
	import LeadCaptureInline from '$lib/components/lead/LeadCaptureInline.svelte';
	import { relocateQuickLinks, relocateSteps, relocateFaq } from '$lib/components/relocate/data.js';
	import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
</script>

<svelte:head>
	<title>Relocate to Ghana | DiasporaJunxion</title>
	<meta
		name="description"
		content="DiasporaJunxion helps diaspora travelers and returners relocate to Ghana with more clarity, context, and connection."
	/>
</svelte:head>

<div class="bg-background text-foreground">
	<RelocateHero />
	<RelocateQuickLinks items={relocateQuickLinks} />
	<div class="mx-auto max-w-5xl px-6 py-10 md:px-10">
		<LeadCaptureInline
			title="Still deciding whether Ghana is a visit or a real move?"
			description={`Start with the free guide: ${DEFAULT_LEAD_MAGNET_NAME}`}
			buttonText="Get the Free Guide"
			source="relocate_page"
			leadMagnet={DEFAULT_LEAD_MAGNET_NAME}
			entryPage="/relocate"
		/>
	</div>
	<RelocateSteps steps={relocateSteps} />
	<RelocateFAQ items={relocateFaq} />
	<RelocateCTA />
</div>
