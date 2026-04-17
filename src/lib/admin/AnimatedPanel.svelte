<script>
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/AnimatedPanel.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {boolean} [active]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { active = false, children } = $props();
	let panelEl = $state();

	onMount(() => {
		if (panelEl) {
			gsap.set(panelEl, {
				x: active ? 0 : 0,
				opacity: active ? 1 : 0,
				pointerEvents: active ? 'auto' : 'none'
			});
		}
	});

	run(() => {
		if (panelEl) {
			gsap.killTweensOf(panelEl);

			if (active) {
				gsap.to(panelEl, {
					x: 0,
					opacity: 1,
					pointerEvents: 'auto',
					duration: 0.4,
					ease: 'power2.out'
				});
			} else {
				gsap.to(panelEl, {
					x: 0,
					opacity: 0,
					pointerEvents: 'none',
					duration: 0.4,
					ease: 'power2.in'
				});
			}
		}
	});
</script>

<div bind:this={panelEl} class="panel absolute top-0 left-0 w-full">
	{@render children?.()}
</div>

<style>
	.panel {
		position: absolute; /* key fix: stack all panels on top of each other */
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1;
	}
</style>
