<script>
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';

	export let introText = 'Introducing DiasporaJunxion’s flagship product…';
	export let heroText = ['S', 'P', '▲', 'C', 'E'];
	export let taglineText =
		'Immersive sound. Futuristic design. Experience music like never before.';

	let introLine, heroTitle, tagline, heroImg;
	const isDev = import.meta.env.MODE === 'development';

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// 🧩 Create fixed marker container so markers never scroll
		const markerContainer = document.createElement('div');
		markerContainer.style.position = 'fixed';
		markerContainer.style.top = '0';
		markerContainer.style.left = '0';
		markerContainer.style.width = '100%';
		markerContainer.style.height = '100%';
		markerContainer.style.pointerEvents = 'none';
		markerContainer.style.zIndex = '9999';
		document.body.appendChild(markerContainer);

		// 🟢 Intro animation
		if (introLine) {
			introLine.innerHTML = introLine.textContent
				.split(' ')
				.map((w) => `<span class="word">${w} </span>`)
				.join('');
		}

		const tl = gsap.timeline();
		tl.from(introLine.querySelectorAll('.word'), {
			y: 20,
			opacity: 0,
			stagger: 0.15,
			duration: 0.8,
			ease: 'power2.out'
		})
			.from(
				heroTitle.querySelectorAll('span'),
				{
					y: 20,
					opacity: 0,
					stagger: 0.1,
					duration: 0.8,
					ease: 'power2.out'
				},
				'+=0.2'
			)
			.from(
				tagline,
				{
					opacity: 0,
					y: 20,
					duration: 1,
					ease: 'power2.out'
				},
				'+=0.2'
			);

		// 🟣 ScrollTrigger for fanout
		const centerIndex = heroText.findIndex((l) => l === '▲');
		const letters = heroTitle.querySelectorAll('span');

		gsap.fromTo(
			letters,
			{ x: 0 },
			{
				x: (i) => (i - centerIndex) * 10 + 'vw',
				duration: 2.5,
				ease: 'expo.out',
				scrollTrigger: {
					trigger: heroTitle,
					start: 'top 175vh',
					end: 'bottom top',
					scrub: false,
					toggleActions: 'play none none reverse',
					markers: isDev
						? {
								parent: markerContainer, // 👈 force fixed parent
								startColor: 'green',
								endColor: 'red',
								fontSize: '14px',
								indent: 20,
								startLabel: 'BEGIN',
								endLabel: 'FINISH',
								name: 'HeroFanout'
							}
						: false
				}
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
		<img bind:this={heroImg} src="/images/speaker-hero.jpeg" alt="SPACE Speaker" />
	</div>
</section>

<style>
	html,
	body {
		overflow-x: hidden;
	}

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
