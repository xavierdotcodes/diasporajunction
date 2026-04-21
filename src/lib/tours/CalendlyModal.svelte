	<script>
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { fileLogger, serializeError } from '$lib/utils/logger';

	const log = fileLogger('src/lib/tours/CalendlyModal.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {boolean} [show]
	 * @property {string} [calendlyUrl]
	 * @property {any} onClose
	 */

	/** @type {Props} */
	let { show = false, calendlyUrl = 'https://calendly.com/diasporajunxion/discovery-call-ghana-immersion-experience', onClose } = $props();

	let modalEl = $state();
	let ready = $state(false);

	async function waitForCalendly() {
		log.info({ phase: 'calendly_wait_started' });
		return new Promise((resolve) => {
			const check = () => {
				if (window.Calendly) {
					log.info({ phase: 'calendly_global_detected' });
					resolve();
				} else {
					setTimeout(check, 100);
				}
			};
			check();
		});
	}

	onMount(async () => {
		log.info({ phase: 'calendly_modal_mount' });

		// load Calendly script once
		if (!window.Calendly) {
			log.info({ phase: 'calendly_script_loading' });
			const script = document.createElement('script');
			script.src = 'https://assets.calendly.com/assets/external/widget.js';
			script.async = true;
			document.body.appendChild(script);
		}

		await waitForCalendly();
		ready = true;
		log.info({ phase: 'calendly_ready' });

		// auto-close when event booked
		window.addEventListener('message', (e) => {
			if (e?.data?.event === 'calendly.event_scheduled') {
				log.info({ phase: 'calendly_event_scheduled' });
				closeModal();
			}
		});
	});

	function initCalendly() {
		const container = document.getElementById('calendly-container');
		if (!container) {
			log.warn({ phase: 'calendly_container_missing' });
			return;
		}

		container.innerHTML = ''; // clear previous iframes

		try {
			log.info({ phase: 'calendly_widget_initializing' });
			window.Calendly.initInlineWidget({
				url: calendlyUrl,
				parentElement: container,
				textColor: '#000000',
				primaryColor: '#F2B705'
			});
			log.info({ phase: 'calendly_widget_initialized' });
		} catch (error) {
			log.error({
				phase: 'calendly_widget_initialization_failed',
				error: serializeError(error)
			});
		}
	}

	function closeModal() {
		log.info({ phase: 'calendly_modal_close_requested' });
		if (onClose) onClose();
	}

	function handleBackdropKeydown(event) {
		if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			closeModal();
		}
	}
</script>

<svelte:head>
	<meta http-equiv="Permissions-Policy" content="payment=()" />
</svelte:head>

{#if show}
	<!-- Backdrop -->
	<div
		bind:this={modalEl}
		class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
		role="button"
		tabindex="0"
		aria-label="Close Calendly modal"
		onclick={(e) => e.target === modalEl && closeModal()}
		onkeydown={handleBackdropKeydown}
		in:fade={{ duration: 250 }}
		out:fade={{ duration: 200 }}
	>
		<!-- Modal Card -->
		<div
			class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 sm:p-8 relative overflow-hidden"
			role="dialog"
			aria-modal="true"
			aria-labelledby="calendly-modal-title"
			tabindex="-1"
			onkeydown={(event) => event.stopPropagation()}
			in:scale={{ start: 0.95, duration: 250, easing: (t) => t * t }}
			out:scale={{ end: 0.95, duration: 200, easing: (t) => t * t }}
			onintroend={() => {
				if (ready) initCalendly();
			}}
		>
			<!-- Close Button -->
			<button
				class="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl transition-transform hover:scale-110"
				onclick={closeModal}
			>
				✕
			</button>

			<!-- Header -->
			<h2 id="calendly-modal-title" class="text-2xl font-bold text-center mb-2 text-[#038C25]">Book Your Discovery Call</h2>
			<p class="text-gray-600 text-center mb-6">
				Choose a time that works best for you to learn more about the Ghana Immersion Experience.
			</p>

			<!-- Calendly Embed -->
			<div
				id="calendly-container"
				class="w-full rounded-2xl border border-gray-200 overflow-hidden"
				style="height:700px;"
			></div>
		</div>
	</div>
{/if}

<style></style>
