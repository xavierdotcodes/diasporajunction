<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let introText = 'Introducing DiasporaJunxion’s flagship product…';
	export let spaceLetters = ['S', 'P', '▲', 'C', 'E'];
	export let heroLetters = ['S', 'P', '▲', 'C', 'E'];
	export let taglineText =
		'Immersive sound. Futuristic design. Experience music like never before.';

	let introLine;
	let spaceTitle;
	let heroTitle;
	let tagline;

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// --- Intro line animation ---
		if (introLine) {
			const words = introLine.textContent
				.split(' ')
				.map((w) => `<span class="word">${w} </span>`)
				.join('');
			introLine.innerHTML = words;

			const wordSpans = introLine.querySelectorAll('.word');

			gsap.from(wordSpans, {
				y: 20,
				opacity: 0,
				stagger: 0.15,
				duration: 0.8,
				ease: 'power2.out'
			});
		}

		// --- SPACE letters fade up ---
		if (spaceTitle) {
			const letters = spaceTitle.querySelectorAll('span');
			gsap.set(letters, { opacity: 0, y: 20 });

			gsap.to(letters, {
				opacity: 1,
				y: 0,
				stagger: 0.1,
				duration: 0.8,
				ease: 'power2.out',
				delay: 0.5
			});

			// --- Expand on scroll ---
			gsap.to(letters, {
				scrollTrigger: {
					trigger: spaceTitle,
					start: 'top 80%',
					end: 'top 50%',
					scrub: true
				},
				scale: 1.3,
				stagger: 0.1,
				ease: 'power2.out'
			});
		}

		// --- Hero letters scroll-triggered ---
		if (heroTitle) {
			const letters = heroTitle.querySelectorAll('span');
			gsap.set(letters, { opacity: 0, scale: 0.5 });

			gsap.to(letters, {
				scrollTrigger: {
					trigger: heroTitle,
					start: 'top 80%',
					end: 'top 50%',
					scrub: true
				},
				opacity: 1,
				scale: 1,
				stagger: 0.1,
				ease: 'power2.out'
			});
		}

		// --- Tagline fade in ---
		if (tagline) {
			gsap.from(tagline, {
				scrollTrigger: {
					trigger: tagline,
					start: 'top 90%',
					end: 'top 70%',
					scrub: true
				},
				opacity: 0,
				y: 20,
				duration: 1,
				ease: 'power2.out'
			});
		}
	});
</script>

<section class="hero-centered">
	<p bind:this={introLine} class="intro-line">{introText}</p>

	<!-- SPACE title -->
	<h2 bind:this={spaceTitle} class="space-title">
		{#each spaceLetters as letter}
			<span>{letter}</span>
		{/each}
	</h2>

	<h1 bind:this={heroTitle} class="logo">
		{#each heroLetters as letter}
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
		color: #666;
	}
	.intro-line .word {
		display: inline-block;
	}

	.space-title {
		display: flex;
		justify-content: center;
		gap: 0.2em;
		margin-top: 0.5rem;
		margin-bottom: 1rem;
		font-size: clamp(2rem, 8vw, 3rem);
		font-weight: 900;
		color: #222; /* neutral dark */
	}
	.space-title span {
		display: inline-block;
		transform-origin: center center;
	}

	.logo {
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 900;
		letter-spacing: 0.15em;
		display: flex;
		justify-content: center;
		gap: 0.1em;
	}

	.tagline {
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		color: #444;
		max-width: 700px;
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
