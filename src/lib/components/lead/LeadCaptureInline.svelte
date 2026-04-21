<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { captureAnalyticsEvent } from '$lib/client/analytics';
	import { captureLead } from '$lib/client/leads.js';
	import { getStoredLeadAttribution, markLeadCaptured, persistLeadAttribution } from '$lib/lead/attribution';
	import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/components/lead/LeadCaptureInline.svelte');

	const dispatch = createEventDispatcher();

	let {
		title = 'Thinking about moving to Ghana?',
		description = `Get the free guide: ${DEFAULT_LEAD_MAGNET_NAME}`,
		buttonText = 'Send Me the Guide',
		source = 'inline_capture',
		leadMagnet = DEFAULT_LEAD_MAGNET_NAME,
		entryPage = undefined,
		redirectTo = '/thank-you',
		viewEventName = 'lead_capture_inline_viewed',
		submitEventName = 'lead_capture_inline_submitted',
		compact = false
	} = $props();

	let container = $state();
	let email = $state('');
	let firstName = $state('');
	let loading = $state(false);
	let success = $state(false);
	let error = $state('');
	let hasTrackedView = $state(false);

	const effectiveEntryPage = $derived(entryPage || page.url.pathname);

	async function handleSubmit(event) {
		event.preventDefault();

		error = '';
		loading = true;

		persistLeadAttribution(window.location);
		const attribution = getStoredLeadAttribution();

		try {
			const result = await captureLead({
				email,
				firstName,
				source,
				leadMagnet,
				entryPage: effectiveEntryPage,
				referrer: attribution.referrer || document.referrer || null,
				utmSource: attribution.utmSource || null,
				utmMedium: attribution.utmMedium || null,
				utmCampaign: attribution.utmCampaign || null,
				utmContent: attribution.utmContent || null
			});

			success = true;
			markLeadCaptured();
			captureAnalyticsEvent(submitEventName, {
				source,
				leadMagnet,
				entryPage: effectiveEntryPage
			});
			dispatch('submitted', result);

			if (redirectTo) {
				window.setTimeout(() => {
					goto(redirectTo);
				}, 700);
			}
		} catch (submitError) {
			error = submitError.message || 'We could not save your email right now.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		persistLeadAttribution(window.location);

		if (!container || hasTrackedView) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting || hasTrackedView) continue;

					hasTrackedView = true;
					captureAnalyticsEvent(viewEventName, {
						source,
						leadMagnet,
						entryPage: effectiveEntryPage
					});
					observer.disconnect();
				}
			},
			{ threshold: 0.35 }
		);

		observer.observe(container);

		return () => observer.disconnect();
	});
</script>

<section
	bind:this={container}
	class={`rounded-[2rem] border border-black/10 ${
		compact ? 'bg-[#fff2bf] p-6' : 'bg-[#fff8e1] p-7 md:p-8'
	} text-black shadow-sm`}
>
	{#if success}
		<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#038C25]">Guide requested</p>
		<h3 class="mt-3 text-2xl font-extrabold md:text-3xl">Check your email</h3>
		<p class="mt-3 max-w-2xl text-sm leading-7 text-black/70 md:text-base">
			Your free DiasporaJunxion guide is on the way. If it doesn’t show up right away, check your
			promotions or spam folder.
		</p>
	{:else}
		<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#D9042B]">Free guide</p>
		<h3 class="mt-3 text-2xl font-extrabold md:text-3xl">{title}</h3>
		<p class="mt-3 max-w-2xl text-sm leading-7 text-black/70 md:text-base">{description}</p>

		<form class="mt-6 flex flex-col gap-3 md:flex-row" onsubmit={handleSubmit}>
			<input
				type="text"
				name="firstName"
				bind:value={firstName}
				placeholder="First name (optional)"
				class="h-12 rounded-full border border-black/10 bg-white px-4 text-sm text-black placeholder:text-black/45 focus:outline-none focus:ring-2 focus:ring-[#D9042B]/30"
				autocomplete="given-name"
			/>
			<input
				type="email"
				name="email"
				bind:value={email}
				placeholder="Email address"
				required
				class="h-12 flex-1 rounded-full border border-black/10 bg-white px-4 text-sm text-black placeholder:text-black/45 focus:outline-none focus:ring-2 focus:ring-[#D9042B]/30"
				autocomplete="email"
			/>
			<button
				type="submit"
				disabled={loading}
				class="inline-flex h-12 items-center justify-center rounded-full bg-[#D9042B] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#b50323] disabled:cursor-not-allowed disabled:opacity-70"
			>
				{loading ? 'Sending...' : buttonText}
			</button>
		</form>

		{#if error}
			<p class="mt-3 text-sm text-[#D9042B]">{error}</p>
		{/if}

		<p class="mt-4 text-xs leading-6 text-black/55">
			We’ll send the guide first, then a short sequence of useful relocation emails. No spam.
		</p>
	{/if}
</section>
