<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { captureAnalyticsEvent } from '$lib/analytics/posthog';

	let {
		title = 'Want the full relocation guide?',
		description = 'Get the deeper, paid resource built to help diaspora movers think in sequence, not guesswork.',
		href = '/ebook'
	} = $props();
</script>

<div class="rounded-3xl border border-[#D9042B]/15 bg-[#D9042B]/5 p-6 md:p-8">
	<h3 class="font-heading text-2xl font-bold text-black dark:text-white">
		{title}
	</h3>

	<p class="mt-3 max-w-2xl text-sm leading-7 text-black/70 dark:text-white/70">
		{description}
	</p>

	<div class="mt-5">
		<Button
			{href}
			class="rounded-full bg-[#D9042B] text-white hover:bg-[#b50323]"
			onclick={() => captureAnalyticsEvent('ebook_cta_clicked', { location: 'ebook_inline_cta' })}
		>
			View the Ebook
		</Button>
	</div>
</div>
