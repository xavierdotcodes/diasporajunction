<script>
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let show = false;
	export let calendlyUrl =
		'https://calendly.com/diasporajunxion/discovery-call-ghana-immersion-experience';
	export let onClose;

	let modalEl;
	let ready = false;

	async function waitForCalendly() {
		console.log('[CalendlyModal] waitForCalendly...');
		return new Promise((resolve) => {
			const check = () => {
				if (window.Calendly) {
					console.log('[CalendlyModal] ✅ Calendly global detected');
					resolve();
				} else {
					setTimeout(check, 100);
				}
			};
			check();
		});
	}

	onMount(async () => {
		console.log('[CalendlyModal] mounted');

		// load Calendly script once
		if (!window.Calendly) {
			console.log('[CalendlyModal] loading Calendly script...');
			const script = document.createElement('script');
			script.src = 'https://assets.calendly.com/assets/external/widget.js';
			script.async = true;
			document.body.appendChild(script);
		}

		await waitForCalendly();
		ready = true;

		// auto-close when event booked
		window.addEventListener('message', (e) => {
			if (e?.data?.event === 'calendly.event_scheduled') closeModal();
		});
	});

	function initCalendly() {
		const container = document.getElementById('calendly-container');
		if (!container) {
			console.warn('[CalendlyModal] container not found');
			return;
		}

		container.innerHTML = ''; // clear previous iframes

		try {
			console.log('[CalendlyModal] 🧩 Initializing Calendly widget...');
			window.Calendly.initInlineWidget({
				url: calendlyUrl,
				parentElement: container,
				textColor: '#000000',
				primaryColor: '#F2B705'
			});
			console.log('[CalendlyModal] ✅ Calendly widget initialized');
		} catch (err) {
			console.error('[CalendlyModal] ❌ Failed to initialize Calendly:', err);
		}
	}

	function closeModal() {
		if (onClose) onClose();
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
		on:click={(e) => e.target === modalEl && closeModal()}
		in:fade={{ duration: 250 }}
		out:fade={{ duration: 200 }}
	>
		<!-- Modal Card -->
		<div
			class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 sm:p-8 relative overflow-hidden"
			in:scale={{ start: 0.95, duration: 250, easing: (t) => t * t }}
			out:scale={{ end: 0.95, duration: 200, easing: (t) => t * t }}
			on:introend={() => {
				if (ready) initCalendly();
			}}
		>
			<!-- Close Button -->
			<button
				class="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl transition-transform hover:scale-110"
				on:click={closeModal}
			>
				✕
			</button>

			<!-- Header -->
			<h2 class="text-2xl font-bold text-center mb-2 text-[#038C25]">Book Your Discovery Call</h2>
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

<style>
	.calendly-inline-widget {
		border-radius: 1rem;
		overflow: hidden;
	}
</style>
