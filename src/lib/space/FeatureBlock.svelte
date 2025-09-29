<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let feature;
	export let reverse = false;

	let blockEl;
	let textEl;
	let imageEl;

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		gsap.from(textEl, {
			x: reverse ? 150 : -150,
			opacity: 0,
			duration: 1.5,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: blockEl,
				start: 'top 35%',
				toggleActions: 'play none none reverse'
			}
		});

		gsap.from(imageEl, {
			x: reverse ? -150 : 150,
			opacity: 0,
			duration: 1.5,
			delay: 0.2,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: blockEl,
				start: 'top 55%',
				toggleActions: 'play none none reverse'
			}
		});
	});
</script>

<div class="feature-block" bind:this={blockEl} class:reverse>
	<div class="feature-text" bind:this={textEl}>
		<h2>{feature.title}</h2>
		<p>{feature.description}</p>
	</div>
	<div class="feature-image" bind:this={imageEl}>
		<img src={feature.image} alt={feature.title} />
	</div>
</div>

<style>
	.feature-block {
		display: flex;
		align-items: center;
		gap: 3rem;
		flex-wrap: wrap;
		margin-bottom: 6rem;
	}

	.feature-block.reverse {
		flex-direction: row-reverse;
	}

	.feature-text {
		flex: 1 1 300px;
	}

	.feature-text h2 {
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		margin-bottom: 1rem;
	}

	.feature-text p {
		font-size: clamp(1.05rem, 2vw, 1.2rem);
		line-height: 1.6;
	}

	.feature-image {
		flex: 1 1 300px;
		display: flex;
		justify-content: center;
	}

	.feature-image img {
		width: 100%;
		max-width: 500px;
		border-radius: 1rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.feature-block,
		.feature-block.reverse {
			flex-direction: column;
			text-align: center;
		}

		.feature-image {
			margin-top: 1.5rem;
		}
	}
</style>
