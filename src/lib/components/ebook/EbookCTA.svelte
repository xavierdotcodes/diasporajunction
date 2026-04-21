<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { captureAnalyticsEvent } from '$lib/client/analytics';

	let {
		eyebrow = 'Featured Resource',
		title = 'Thriving in Ghana (With Children)',
		description = 'A paid guide for diaspora parents and future movers who want a more structured, grounded path into life in Ghana.',
		href = '/ebook',
		price = '$15',
		note = 'Built for people thinking beyond the vacation lens.'
	} = $props();
</script>

<Card.Root class="rounded-3xl border-white/10 bg-white/5 text-white shadow-none">
	<Card.Content class="p-8 md:p-10">
		<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
			<div class="max-w-2xl">
				<Badge variant="outline" class="mb-5 border-[#FFBC03]/40 bg-[#FFBC03]/10 text-[#FFBC03]">
					{eyebrow}
				</Badge>

				<h2 class="font-heading text-3xl font-extrabold md:text-4xl">
					{title}
				</h2>

				<p class="mt-4 text-base leading-7 text-white/75">
					{description}
				</p>

				<p class="mt-4 text-sm text-white/55">
					{note}
				</p>
			</div>

			<div class="flex shrink-0 flex-col gap-3 md:min-w-[180px]">
				<div class="text-3xl font-extrabold text-white">{price}</div>

				<Button
					{href}
					class="rounded-full bg-[#D9042B] text-white hover:bg-[#b50323]"
					onclick={() => captureAnalyticsEvent('ebook_cta_clicked', { location: 'ebook_showcase_primary' })}
				>
					View the Ebook
				</Button>

				<Button
					{href}
					variant="outline"
					class="rounded-full border-white/15 bg-transparent text-white hover:bg-white/10"
					onclick={() => captureAnalyticsEvent('ebook_cta_clicked', { location: 'ebook_showcase_secondary' })}
				>
					Learn More
				</Button>
			</div>
		</div>
	</Card.Content>
</Card.Root>
