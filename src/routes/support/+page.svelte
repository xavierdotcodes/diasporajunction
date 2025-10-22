<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	const gofundmeUrl = 'https://www.gofundme.com/f/your-campaign';
	const kickstarterUrl = 'https://www.kickstarter.com/projects/your-campaign';

	onMount(() => {
		gsap.from('.hero-content > *', { opacity: 0, y: 40, stagger: 0.2, duration: 1 });
		gsap.from('.impact-card', { opacity: 0, y: 40, stagger: 0.2, duration: 1, delay: 0.3 });
	});
</script>

<section class="hero">
	<div class="overlay"></div>
	<div class="hero-content">
		<h1>
			<span class="green">Support</span> <span class="yellow">Diaspora</span><span class="red"
				>Junxion</span
			>
		</h1>
		<p>
			Empowering Ghanaian artists, makers, and entrepreneurs to reach the diaspora and the world.
			Your support funds workshops, resources, and growth opportunities for these creative talents.
		</p>

		<div class="cta-buttons">
			<a class="cta gofundme" href={gofundmeUrl} target="_blank" rel="noopener noreferrer">
				Donate via GoFundMe
			</a>
			<a class="cta kickstarter" href={kickstarterUrl} target="_blank" rel="noopener noreferrer">
				Back on Kickstarter
			</a>
		</div>
	</div>
</section>

<section class="impact-section">
	<h2>How Your Support Makes an Impact</h2>
	<p>
		Every contribution brings us closer to creating sustainable opportunities for creative talents
		in Ghana.
	</p>

	<div class="impact-grid">
		<div class="impact-card">
			<h3>$25 Donation</h3>
			<p>Funds art materials for one workshop participant.</p>
		</div>
		<div class="impact-card">
			<h3>$50 Donation</h3>
			<p>Supports a mentorship session for aspiring entrepreneurs.</p>
		</div>
		<div class="impact-card">
			<h3>$100 Donation</h3>
			<p>Helps launch a small-scale artisan project to reach international buyers.</p>
		</div>
	</div>
</section>

<style>
	:root {
		--green: #038c25;
		--yellow: #ffd700;
		--red: #d9042b;
	}

	.hero {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 6rem 1rem;
		background: linear-gradient(135deg, #0d0d0d, #1a1a1a);
		color: white;
		overflow: hidden;
	}

	.hero::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 20% 30%, var(--green), transparent 60%),
			radial-gradient(circle at 80% 70%, var(--red), transparent 60%);
		opacity: 0.3;
		z-index: 0;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: 800px;
	}

	h1 {
		font-size: 2.8rem;
		font-weight: 800;
		line-height: 1.2;
		margin-bottom: 1.2rem;
	}

	.green {
		color: var(--green);
	}
	.yellow {
		color: var(--yellow);
	}
	.red {
		color: var(--red);
	}

	.hero p {
		font-size: 1.2rem;
		max-width: 650px;
		margin: 0 auto 2.5rem;
		color: #e2e8f0;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.cta {
		text-decoration: none;
		padding: 0.9rem 1.8rem;
		border-radius: 50px;
		font-weight: 700;
		font-size: 1rem;
		transition: all 0.25s ease;
		color: white;
	}

	.gofundme {
		background: var(--green);
	}
	.kickstarter {
		background: var(--yellow);
		color: #111;
	}

	.cta:hover {
		transform: translateY(-3px) scale(1.05);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	}

	.impact-section {
		padding: 5rem 1rem;
		max-width: 1000px;
		margin: 0 auto;
		text-align: center;
		color: #111;
	}

	.impact-section h2 {
		font-size: 2.2rem;
		margin-bottom: 1rem;
		color: var(--green);
	}

	.impact-section p {
		font-size: 1.1rem;
		margin-bottom: 3rem;
		color: #333;
	}

	.impact-grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.impact-card {
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(8px);
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.impact-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
	}

	.impact-card h3 {
		margin-bottom: 0.5rem;
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--red);
	}

	.impact-card p {
		font-size: 1.05rem;
		color: #444;
	}
</style>
