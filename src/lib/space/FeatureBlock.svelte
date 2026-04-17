<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/space/FeatureBlock.svelte');
	let { features = [
		{
			title: 'Premium Sound',
			description:
				'Feel the beat. Every note, every bass drop, crystal clear. Your music, elevated.',
			image: 'images/space/speaker1.jpeg'
		},
		{
			title: 'Minimalist Design',
			description: 'Looks as good as it sounds. Complements any room or setup seamlessly.',
			image: 'images/space/speaker2.jpeg'
		},
		{
			title: 'Built for Portability',
			description: 'Take your soundtrack anywhere. Compact, durable, adventure-ready.',
			image: 'images/space/speaker3.jpeg'
		},
		{
			title: 'Wireless Freedom',
			description: 'Cut the cords. Effortless Bluetooth connection wherever you go.',
			image: 'images/space/speaker4.jpeg'
		}
	] } = $props();

	// Keep a stable ref bucket per feature so bind:this assignments survive updates.
	let blocks = $state([]);

	$effect(() => {
		blocks = features.map(
			(_, index) =>
				blocks[index] ?? {
					blockEl: null,
					textEl: null,
					imageEl: null
				}
		);
	});

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		blocks.forEach(({ blockEl, textEl, imageEl }, index) => {
			const reverse = index % 2 === 1;

			ScrollTrigger.matchMedia({
				'(max-width: 768px)': () => {
					gsap.from(textEl, {
						x: reverse ? 100 : -100,
						opacity: 0,
						duration: 1.2,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: blockEl,
							start: 'top 70%',
							toggleActions: 'play none none reverse'
						}
					});

					gsap.from(imageEl, {
						x: reverse ? -100 : 100,
						opacity: 0,
						duration: 1.2,
						delay: 0.2,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: blockEl,
							start: 'top 75%',
							toggleActions: 'play none none reverse'
						}
					});
				},
				'(min-width: 769px)': () => {
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
				}
			});
		});
	});
</script>

{#each features as feature, index}
	<div class="feature-block {index % 2 === 1 ? 'reverse' : ''}" bind:this={blocks[index].blockEl}>
		<div class="feature-text" bind:this={blocks[index].textEl}>
			<h2>{feature.title}</h2>
			<p>{feature.description}</p>
		</div>
		<div class="feature-image" bind:this={blocks[index].imageEl}>
			<img src={feature.image} alt={feature.title} />
		</div>
	</div>
{/each}

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

	@media (max-width: 768px) {
		.feature-block,
		.feature-block.reverse {
			flex-direction: column;
			text-align: center;
		}

		.feature-text {
			flex: none;
			width: 100%;
			max-width: 95%;
			margin: 0 auto;
		}

		.feature-text h2 {
			margin-bottom: 1.5rem;
		}

		.feature-text p {
			font-size: 1rem;
			line-height: 1.5;
		}

		.feature-image {
			margin-top: 2rem;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
</style>
