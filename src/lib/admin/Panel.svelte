<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let name;
	export let active = false;

	let panelEl;

	onMount(() => {
		panelEl.style.display = active ? 'block' : 'none';
	});

	$: if (panelEl) {
		if (active) {
			panelEl.style.display = 'block';
			gsap.fromTo(panelEl, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 });
		} else {
			gsap.to(panelEl, {
				x: -50,
				opacity: 0,
				duration: 0.4,
				onComplete: () => (panelEl.style.display = 'none')
			});
		}
	}
</script>

<div bind:this={panelEl} class="panel absolute w-full">
	<slot />
</div>
