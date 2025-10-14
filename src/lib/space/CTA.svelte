<script>
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import gsap from 'gsap';

	const dispatch = createEventDispatcher();

	function openModal() {
		dispatch('openModal');
	}

	let wordContainer;

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		await tick();

		const letters = wordContainer.querySelectorAll('.letter');
		const mm = gsap.matchMedia();

		mm.add(
			{
				isMobile: '(max-width: 480px)',
				isTablet: '(min-width: 481px) and (max-width: 767px)',
				isDesktop: '(min-width: 768px)'
			},
			(context) => {
				const { isMobile, isTablet, isDesktop } = context.conditions;

				let multiplier, sOffset, start, id;

				if (isMobile) {
					multiplier = 2.5;
					sOffset = 0.3;
					start = 'top 85%';
					id = 'cta-mobile';
				} else if (isTablet) {
					multiplier = 3.5;
					sOffset = 0.4;
					start = 'top 70%';
					id = 'cta-tablet';
				} else if (isDesktop) {
					multiplier = 0.45;
					sOffset = 0.3;
					start = 'top 70%';
					id = 'cta-desktop';
				}

				// Fan-out animation (letters shift right)
				gsap.fromTo(
					letters,
					{ x: 0 },
					{
						x: (i) => i * multiplier + 'vw',
						duration: 2.5,
						ease: 'expo.out',
						scrollTrigger: {
							id,
							trigger: wordContainer,
							start,
							end: 'bottom 60%',
							scrub: false,
							markers: import.meta.env.MODE === 'development'
						}
					}
				);
			}
		);
	});
</script>

<section class="cta">
	<h2>Ready to transform your sound experience?</h2>
	<p>
		Join thousands already upgrading their lifestyle with
		<strong class="word" bind:this={wordContainer}>
			<span class="letter">S</span>
			<span class="letter">P</span>
			<span class="letter triangle">
				<svg viewBox="0 0 100 100">
					<polygon points="50,0 100,100 0,100" fill="currentColor" />
				</svg>
			</span>
			<span class="letter">C</span>
			<span class="letter">E</span>
			<span class="letter">.</span>
		</strong>
	</p>
	<button class="cta-button" on:click={openModal}>Pre-Order Now</button>
</section>

<style>
	.cta {
		text-align: center;
		padding: 3rem 1rem;
		background: linear-gradient(135deg, #1e1e2f, #2d2d44);
		color: white;
		border-radius: 1rem;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
	}

	.cta h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.cta p {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
		line-height: 1.4;
	}

	.cta-button {
		margin-top: 1.5rem;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border: none;
		border-radius: 0.5rem;
		background: #ff6f61;
		color: white;
		cursor: pointer;
		transition: background 0.3s;
	}

	.cta-button:hover {
		background: #ff4a3d;
	}

	.word {
		display: inline-block;
		font-weight: bold;
		font-size: inherit;
	}

	.letter {
		display: inline-block;
		line-height: 1;
		font-size: inherit;
	}

	.triangle {
		width: 0.9em;
		height: 0.9em;
		vertical-align: baseline;
		display: inline-block;
	}

	.triangle svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	/* 🟣 ScrollTrigger Marker Color Coding for CTA */
	#gspath-marker-cta-mobile-start,
	#gspath-marker-cta-mobile-end {
		color: #b794f4 !important;
		border-color: #b794f4 !important;
		background: rgba(183, 148, 244, 0.2) !important;
	}

	#gspath-marker-cta-tablet-start,
	#gspath-marker-cta-tablet-end {
		color: #d53f8c !important;
		border-color: #d53f8c !important;
		background: rgba(213, 63, 140, 0.2) !important;
	}

	#gspath-marker-cta-desktop-start,
	#gspath-marker-cta-desktop-end {
		color: #9f7aea !important;
		border-color: #9f7aea !important;
		background: rgba(159, 122, 234, 0.2) !important;
	}
</style>
