<script>
	import { onMount } from 'svelte';
	import { captureAnalyticsEvent } from '$lib/analytics/posthog';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/routes/(site)/thank-you/+page.svelte');

	onMount(() => {
		captureAnalyticsEvent('thank_you_page_viewed');
	});
</script>

<svelte:head>
	<title>Check Your Email | DiasporaJunxion</title>
	<meta
		name="description"
		content="Thanks for signing up. Check your email for the free DiasporaJunxion Ghana reality guide."
	/>
</svelte:head>

<section class="bg-[#fff8e1] px-6 py-24 text-black">
	<div class="mx-auto max-w-4xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm md:p-12">
		<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#D9042B]">DiasporaJunxion</p>
		<h1 class="mt-4 text-3xl font-extrabold md:text-5xl">Check your email for the free guide</h1>
		<p class="mt-5 max-w-3xl text-base leading-7 text-black/70 md:text-lg">
			You should receive <strong>Visiting Ghana vs Living in Ghana: A Quick Reality Guide</strong>
			shortly. If you don’t see it, check your promotions or spam folder.
		</p>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			<a
				href="/start-here"
				class="rounded-[1.5rem] border border-black/10 bg-[#f8f2dd] p-5 transition-colors hover:bg-[#f3ead1]"
			>
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#038C25]">Start Here</p>
				<p class="mt-3 text-sm leading-6 text-black/70">Get the grounded overview of how to think about the move.</p>
			</a>
			<a
				href="/relocate"
				class="rounded-[1.5rem] border border-black/10 bg-[#f8f2dd] p-5 transition-colors hover:bg-[#f3ead1]"
			>
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#038C25]">Relocate</p>
				<p class="mt-3 text-sm leading-6 text-black/70">Go deeper on relocation questions, timing, and practical context.</p>
			</a>
			<a
				href="/guides"
				class="rounded-[1.5rem] border border-black/10 bg-[#f8f2dd] p-5 transition-colors hover:bg-[#f3ead1]"
			>
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#038C25]">Guides</p>
				<p class="mt-3 text-sm leading-6 text-black/70">Explore more guidance on family, belonging, housing, and daily life.</p>
			</a>
		</div>
	</div>
</section>
