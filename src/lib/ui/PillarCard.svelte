<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/ui/PillarCard.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {any} title
	 * @property {any} subtitle
	 * @property {any} description
	 * @property {any} image
	 * @property {number} [index]
	 */

	/** @type {Props} */
	let {
		title,
		subtitle,
		description,
		image,
		index = 0
	} = $props();

	let reverse = $derived(index % 2 === 0 ? true : false);

	let card = $state(), imageEl = $state(), textEl = $state();

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// fade + parallax entrance
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: card,
				start: 'top 80%',
				end: 'bottom 70%',
				toggleActions: 'play none none reverse'
			}
		});

		tl.fromTo(
			imageEl,
			{ opacity: 0, filter: 'blur(15px)', scale: 1.15 },
			{ opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.8, ease: 'power3.out' }
		).fromTo(
			textEl,
			{ y: 80, opacity: 0 },
			{ y: 0, opacity: 1, duration: 1.4, ease: 'power2.out' },
			'-=1.2'
		);

		// continuous slow breathing zoom
		gsap.to(imageEl, {
			scale: 1.05,
			duration: 8,
			ease: 'sine.inOut',
			repeat: -1,
			yoyo: true
		});
	});
</script>

<div class="pillar-card" bind:this={card} class:reverse>
	<div class="pillar-image" bind:this={imageEl}>
		<img src={image} alt={title} loading="lazy" />
	</div>

	<div class="pillar-text" bind:this={textEl}>
		<h3>{title}</h3>
		<p class="subtitle">{subtitle}</p>
		<p class="desc">{description}</p>
	</div>
</div>

<style>
	.pillar-card {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 85vh;
		width: 100%;
		overflow: hidden;
		margin: 5rem 0;
		padding: 1rem;
	}

	.pillar-card.reverse {
		flex-direction: row-reverse;
	}

	.pillar-image {
		position: relative;
		height: 100%;
		overflow: hidden;
		border-radius: 2rem;
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
	}

	.pillar-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 2rem;
	}

	.pillar-text {
		position: absolute;
		bottom: 10%;
		left: 6%;
		color: white;
		background: #0f0f0f;
		padding: 2.5rem 3rem;
		max-width: 440px;
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
		border-left: 6px solid #facc15;
	}

	.pillar-card.reverse .pillar-text {
		left: auto;
		right: 6%;
		border-left: none;
		border-right: 6px solid #facc15;
	}

	h3 {
		font-size: 2.2rem;
		font-weight: 700;
		margin-bottom: 0.4rem;
		line-height: 1.1;
		color: white;
	}

	.subtitle {
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		color: #e5e5e5;
		margin-bottom: 1rem;
	}

	.desc {
		font-size: 1rem;
		line-height: 1.6;
		color: #dcdcdc;
	}

	@media (max-width: 768px) {
		.pillar-card {
			flex-direction: column !important;
			min-height: auto;
		}
		.pillar-text {
			position: relative;
			left: auto;
			right: auto;
			bottom: auto;
			max-width: 95%;
			margin-top: -2rem;
			padding: 1.5rem;
			border-radius: 1rem;
			border: none;
			border-top: 4px solid #facc15;
			background: #0f0f0f;
		}
		h3 {
			font-size: 1.6rem;
		}
	}
</style>
