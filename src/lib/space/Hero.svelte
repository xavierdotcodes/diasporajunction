<script>
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';

	export let introText = 'Introducing DiasporaJunxion’s flagship product…';
	export let heroText = ['S', 'P', '▲', 'C', 'E'];
	export let taglineText =
		'Immersive sound. Futuristic design. Experience music like never before.';

	let introLine;
	let heroTitle;
	let tagline;

	const isDev = import.meta.env.MODE === 'development';

	onMount(async () => {
		const { ScrollTrigger, matchMedia } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		await tick();

		// Split intro into individual words for staggered animation
		if (introLine) {
			const words = introLine.textContent
				.split(' ')
				.map((w) => `<span class="word">${w} </span>`)
				.join('');
			introLine.innerHTML = words;
		}

		// Base timeline
		const tl = gsap.timeline();

		// 1️⃣ Intro text fade-in word by word
		tl.from(introLine.querySelectorAll('.word'), {
			y: 20,
			opacity: 0,
			stagger: 0.15,
			duration: 0.8,
			ease: 'power2.out'
		});

		// 2️⃣ Hero letters fade in
		if (heroTitle) {
			tl.from(
				heroTitle.querySelectorAll('span'),
				{
					y: 20,
					opacity: 0,
					stagger: 0.1,
					duration: 0.8,
					ease: 'power2.out'
				},
				'+=0.2'
			);
		}

		// 3️⃣ Tagline fade in
		if (tagline) {
			tl.from(
				tagline,
				{
					opacity: 0,
					y: 20,
					duration: 1,
					ease: 'power2.out'
				},
				'+=0.2'
			);
		}

		// 4️⃣ Responsive scroll-triggered fan out
		const mm = gsap.matchMedia();
		const centerIndex = heroText.findIndex((l) => l === '▲');

		mm.add(
			{
				isMobile: '(max-width: 480px)',
				isTablet: '(min-width: 481px) and (max-width: 767px)',
				isDesktop: '(min-width: 768px)'
			},
			(context) => {
				const { isMobile, isTablet, isDesktop } = context.conditions;
				const letters = heroTitle.querySelectorAll('span');
				let multiplier, start;

				if (isMobile) {
					multiplier = 6;
					start = 'top 25%';
				} else if (isTablet) {
					multiplier = 10;
					start = 'top 20%';
				} else if (isDesktop) {
					multiplier = 15;
					start = 'top 15%';
				}

				// Fan-out animation triggered by scroll
				gsap.fromTo(
					letters,
					{ x: 0 },
					{
						x: (i) => (i - centerIndex) * multiplier + 'vw',
						duration: 4,
						ease: 'expo.out',
						scrollTrigger: {
							trigger: heroTitle,
							start,
							end: 'top 0%',
							scrub: false,
							markers: isDev
						}
					}
				);
			}
		);
	});
</script>

<section class="hero-centered">
	<p bind:this={introLine} class="intro-line">{introText}</p>

	<h1 bind:this={heroTitle} class="hero-title">
		{#each heroText as letter}
			<span>{letter}</span>
		{/each}
	</h1>

	<p bind:this={tagline} class="tagline">{taglineText}</p>

	<div class="hero-image">
		<img src="/images/speaker-hero.jpeg" alt="SPACE Speaker" />
	</div>
</section>

<style>
	.hero-centered {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 6rem;
		padding: 0 1rem;
	}

	.intro-line {
		font-size: clamp(1rem, 4vw, 1.25rem);
		color: #ccc;
	}
	.intro-line .word {
		display: inline-block;
	}

	.hero-title {
		font-size: clamp(3rem, 12vw, 6rem);
		font-weight: 900;
		letter-spacing: 0.05em;
		display: flex;
		justify-content: center;
		gap: 0.05em;
		color: white;
		margin-top: 0.5rem;
	}
	.hero-title span {
		display: inline-block;
		transform-origin: center center;
	}

	.tagline {
		font-size: clamp(1rem, 2.5vw, 1.75rem);
		color: #ddd;
		max-width: 90%;
		margin-top: 1rem;
	}

	.hero-image {
		width: 100%;
		max-width: 800px;
		margin-top: 2rem;
	}
	.hero-image img {
		width: 100%;
		border-radius: 1rem;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
	}
</style>
