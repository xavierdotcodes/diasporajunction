<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { captureAnalyticsEvent } from '$lib/client/analytics';
	import LeadCaptureInline from '$lib/components/lead/LeadCaptureInline.svelte';
	import {
		dismissLeadModal,
		hasCapturedLead,
		isLeadModalDismissed,
		persistLeadAttribution
	} from '$lib/lead/attribution';
	import {
		DEFAULT_LEAD_MAGNET_NAME,
		LEAD_CAPTURE_EXCLUDED_PATHS
	} from '$lib/lead/constants';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/components/lead/LeadCaptureModal.svelte');

	let open = $state(false);
	let hasShown = $state(false);

	function isExcludedPath(pathname) {
		return LEAD_CAPTURE_EXCLUDED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
	}

	function canShowModal(pathname) {
		return !open && !hasShown && !hasCapturedLead() && !isLeadModalDismissed() && !isExcludedPath(pathname);
	}

	function showModal(trigger) {
		if (!canShowModal(page.url.pathname)) return;

		open = true;
		hasShown = true;
		captureAnalyticsEvent('lead_capture_modal_viewed', {
			trigger,
			page: page.url.pathname,
			leadMagnet: DEFAULT_LEAD_MAGNET_NAME
		});
	}

	function closeModal() {
		open = false;
	}

	function dismissModal() {
		dismissLeadModal();
		captureAnalyticsEvent('lead_capture_modal_dismissed', {
			page: page.url.pathname,
			leadMagnet: DEFAULT_LEAD_MAGNET_NAME
		});
		closeModal();
	}

	$effect(() => {
		if (typeof document === 'undefined') return;

		document.body.style.overflow = open ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!canShowModal(page.url.pathname)) return;

		persistLeadAttribution(window.location);

		const timerId = window.setTimeout(() => {
			showModal('time_on_page');
		}, 45_000);

		const handleScroll = () => {
			const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (scrollableHeight <= 0) return;

			const depth = window.scrollY / scrollableHeight;
			if (depth >= 0.6) {
				showModal('scroll_depth');
			}
		};

		const handleMouseLeave = (event) => {
			if (window.innerWidth < 1024) return;
			if (event.clientY <= 0) {
				showModal('exit_intent');
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		document.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			window.clearTimeout(timerId);
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mouseleave', handleMouseLeave);
		};
	});

	onMount(() =>
		afterNavigate(() => {
			open = false;
			hasShown = false;
			persistLeadAttribution(window.location);
		})
	);
</script>

{#if open}
	<div class="fixed inset-0 z-[140] px-4 py-6 md:p-8">
		<div
			class="absolute inset-0 bg-black/55 backdrop-blur-sm"
			role="button"
			tabindex="0"
			aria-label="Dismiss lead capture modal"
			onclick={dismissModal}
			onkeydown={(event) => {
				if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					dismissModal();
				}
			}}
		></div>

		<div class="relative mx-auto mt-16 max-w-2xl md:mt-24">
			<div class="rounded-[2rem] border border-white/10 bg-[#1b1300] p-3 shadow-2xl">
				<div class="rounded-[1.5rem] bg-[#f2b705] p-2">
					<div class="flex items-start justify-between gap-4 px-4 pt-4">
						<div>
							<p class="text-xs font-semibold uppercase tracking-[0.24em] text-black/55">
								DiasporaJunxion
							</p>
							<p class="mt-2 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-black/60">
								Relocation. Belonging. Opportunity.
							</p>
						</div>
						<button
							type="button"
							class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800"
							aria-label="Close lead capture modal"
							onclick={dismissModal}
						>
							×
						</button>
					</div>

					<div class="p-4">
						<LeadCaptureInline
							title="Thinking about Ghana seriously?"
							description={`Get the free quick guide: ${DEFAULT_LEAD_MAGNET_NAME}`}
							buttonText="Send Me the Guide"
							source="global_modal"
							leadMagnet={DEFAULT_LEAD_MAGNET_NAME}
							entryPage={page.url.pathname}
							viewEventName="lead_capture_modal_viewed"
							submitEventName="lead_capture_modal_submitted"
							compact
							on:submitted={() => {
								closeModal();
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
