<script>
	import InvestHero from '$lib/components/invest/InvestHero.svelte';
	import InvestPillars from '$lib/components/invest/InvestPillars.svelte';
	import InvestSectors from '$lib/components/invest/InvestSectors.svelte';
	import InvestPrinciples from '$lib/components/invest/InvestPrinciples.svelte';
	import InvestCTA from '$lib/components/invest/InvestCTA.svelte';

	import { investPillars, investSectors, investPrinciples } from '$lib/components/invest/data.js';
</script>

<svelte:head>
	<title>Invest in Ghana | DiasporaJunxion</title>
	<meta
		name="description"
		content="Explore diaspora investment context, opportunity, and grounded guidance around Ghana through DiasporaJunxion."
	/>
</svelte:head>

<div class="bg-background text-foreground">
	<InvestHero />
	<InvestPillars items={investPillars} />
	<InvestSectors items={investSectors} />
	<InvestPrinciples items={investPrinciples} />
	<InvestCTA />
</div>
