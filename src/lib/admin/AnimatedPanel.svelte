<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let active = false;
	let panelEl;

	onMount(() => {
		if (panelEl) {
			gsap.set(panelEl, {
				x: active ? 0 : 0,
				opacity: active ? 1 : 0,
				pointerEvents: active ? 'auto' : 'none'
			});
		}
	});

	$: if (panelEl) {
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
</script>

<div bind:this={panelEl} class="panel absolute top-0 left-0 w-full">
	<slot />
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
