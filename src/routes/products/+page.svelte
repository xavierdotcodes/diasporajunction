<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import PaymentModal from '$lib/PaymentModal.svelte';
	import Footer from '$lib/Footer.svelte';

	const productFeatures = [
		{
			title: 'Premium Sound',
			description:
				'Experience crystal clear audio with deep bass and vibrant highs, crafted for true music lovers.',
			image: '/images/speaker1.jpeg'
		},
		{
			title: 'Minimalist Design',
			description:
				'Our SP△CE mini speakers blend seamlessly into any home or studio with timeless elegance.',
			image: '/images/speaker2.jpeg'
		},
		{
			title: 'Built for Portability',
			description:
				'Take your music anywhere. Compact, durable, and always reliable for your adventures.',
			image: '/images/speaker3.jpeg'
		},
		{
			title: 'Wireless Freedom',
			description:
				'No more tangled wires. Enjoy effortless Bluetooth connectivity with long-lasting battery life.',
			image: '/images/speaker4.jpeg'
		}
	];

	let introLine;
	let heroTitle;
	let tagline;

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// --- INTRO LINE ---
		if (introLine) {
			const words = introLine.textContent
				.split(' ')
				.map((w) => `<span class="word">${w} </span>`)
				.join('');
			introLine.innerHTML = words;

			const wordSpans = introLine.querySelectorAll('.word');

			// Timeline for sequential animations
			const heroTl = gsap.timeline();

			// Animate intro words
			heroTl.from(wordSpans, {
				y: 20,
				opacity: 0,
				stagger: 0.15,
				duration: 0.8,
				ease: 'power2.out'
			});

			// --- HERO TITLE FADE IN SEQUENCE ---
			if (heroTitle) {
				const letters = heroTitle.querySelectorAll('span');
				gsap.set(letters, { opacity: 0, scale: 0.8 });

				heroTl.to(
					letters,
					{
						opacity: 1,
						scale: 1,
						stagger: 0.15,
						duration: 0.8,
						ease: 'power2.out'
					},
					'+=0.1'
				);
			}

			// --- TAGLINE FADE IN ---
			if (tagline) {
				heroTl.from(
					tagline,
					{
						opacity: 0,
						y: 20,
						duration: 1,
						ease: 'power2.out'
					},
					'+=0.1'
				);
			}

			// --- HERO TITLE EXPANSION ON SCROLL ---
			if (heroTitle) {
				const letters = heroTitle.querySelectorAll('span');
				gsap.to(letters, {
					scrollTrigger: {
						trigger: heroTitle,
						start: 'top 25%',
						markers: true
					},
					x: (i) => (i - (letters.length - 1) / 2) * 160,
					duration: 2,
					ease: 'expo.out'
				});
			}
		}

		// --- FEATURE BLOCKS ---
		const blocks = document.querySelectorAll('.feature-block');
		blocks.forEach((block, i) => {
			const text = block.querySelector('.feature-text');
			const image = block.querySelector('.feature-image');

			gsap.from(text, {
				x: i % 2 === 0 ? -150 : 150,
				opacity: 0,
				duration: 1.5,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: block,
					start: 'top 35%',
					toggleActions: 'play none none reverse'
				}
			});

			gsap.from(image, {
				x: i % 2 === 0 ? 150 : -150,
				opacity: 0,
				duration: 1.5,
				delay: 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: block,
					start: 'top 55%',
					toggleActions: 'play none none reverse'
				}
			});
		});
	});
</script>

<div class="product-page">
	<!-- Hero Section -->
	<section class="hero-centered">
		<p bind:this={introLine} class="intro-line">Introducing DiasporaJunxion’s flagship product…</p>

		<h1 bind:this={heroTitle} class="logo">
			<span>S</span><span>P</span><span class="triangle">▲</span><span>C</span><span>E</span>
		</h1>

		<p bind:this={tagline} class="tagline">
			Immersive sound. Futuristic design. Experience music like never before.
		</p>

		<div class="hero-image">
			<img src="/images/speaker-hero.jpeg" alt="SPACE Speaker" />
		</div>
	</section>

	<!-- Product Features -->
	{#each productFeatures as feature, i}
		<div class="feature-block">
			<div class="feature-text">
				<h2>{feature.title}</h2>
				<p>{feature.description}</p>
			</div>
			<div class="feature-image">
				<img src={feature.image} alt={feature.title} />
			</div>
		</div>
	{/each}

	<!-- CTA Section -->
	<section class="cta">
		<h2>Ready to transform your sound experience?</h2>
		<p>
			Join thousands already upgrading their lifestyle with
			<strong
				>SP<span class="triangle"
					><svg viewBox="0 0 100 100"
						><polygon points="50,0 100,100 0,100" fill="currentColor" /></svg
					></span
				>CE</strong
			>.
		</p>
		<PaymentModal />
	</section>
</div>

<Footer />

<style>
	.product-page {
		display: flex;
		flex-direction: column;
		gap: 10rem;
		padding: 6rem 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.hero-centered {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 8rem;
	}

	.intro-line {
		font-size: 1.5rem;
		color: #777;
	}
	.intro-line .word {
		display: inline-block;
	}

	.logo {
		font-size: 6rem;
		font-weight: 900;
		letter-spacing: 0.15em;
		display: flex;
		justify-content: center;
		gap: 0.1em;
	}
	.triangle {
		font-size: 1em;
		display: inline-block;
	}

	.tagline {
		font-size: 1.75rem;
		color: #555;
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

	.cta-button {
		background: #d9042b;
		color: white;
		font-size: 1.25rem;
		font-weight: bold;
		padding: 1rem 2.5rem;
		border-radius: 9999px;
		margin-top: 1rem;
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}
	.cta-button:hover {
		transform: scale(1.05);
		background: #b30322;
	}

	/* Features */
	.feature-block {
		display: flex;
		align-items: center;
		gap: 4rem;
	}
	.feature-block:nth-child(even) {
		flex-direction: row-reverse;
	}
	.feature-text {
		flex: 1;
	}
	.feature-text h2 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}
	.feature-text p {
		font-size: 1.25rem;
		line-height: 1.6;
	}
	.feature-image {
		flex: 1;
	}
	.feature-image img {
		width: 100%;
		border-radius: 1rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
	}

	/* CTA Section */
	.cta {
		text-align: center;
		padding: 6rem 2rem;
		background: linear-gradient(135deg, #d9042b, #038c25);
		color: white;
		border-radius: 1.5rem;
	}
	.cta h2 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}
	.cta p {
		font-size: 1.25rem;
		margin-bottom: 2rem;
	}
	.cta-button {
		background: white;
		color: #d9042b;
		font-size: 1.25rem;
		font-weight: bold;
		padding: 1rem 2.5rem;
		border-radius: 9999px;
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}
	.cta-button:hover {
		transform: scale(1.05);
		background: #f0f0f0;
	}
</style>
