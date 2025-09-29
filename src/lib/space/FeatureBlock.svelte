<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let features = []; // array of { title, description, image }

	let blocks = [];

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Iterate over each block and attach scroll animations
		blocks.forEach(({ blockEl, textEl, imageEl }, index) => {
			const reverse = index % 2 === 1; // zig-zag every other block

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
	<div class="feature-block {index % 2 === 1 ? 'reverse' : ''}" bind:this={blocks[index]?.blockEl}>
		<div class="feature-text" bind:this={blocks[index]?.textEl}>
			<h2>{feature.title}</h2>
			<p>{feature.description}</p>
		</div>
		<div class="feature-image" bind:this={blocks[index]?.imageEl}>
			<img src={feature.image} alt={feature.title} />
		</div>
	</div>

	<!-- Initialize block references for GSAP -->
	<script>
		blocks[index] = blocks[index] || {};
		blocks[index].blockEl = blocks[index].blockEl;
		blocks[index].textEl = blocks[index].textEl;
		blocks[index].imageEl = blocks[index].imageEl;
	</script>
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

	/* Mobile / responsive adjustments */
	@media (max-width: 768px) {
		.feature-block,
		.feature-block.reverse {
			flex-direction: column;
			text-align: center;
		}

		.feature-text {
			flex: none; /* prevent stretching */
			width: 100%;
			max-width: 95%;
			margin: 0 auto; /* center horizontally */
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
