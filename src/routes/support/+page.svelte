<script>
	// You can adjust these URLs to your campaigns
	const gofundmeUrl = 'https://www.gofundme.com/f/your-campaign';
	const kickstarterUrl = 'https://www.kickstarter.com/projects/your-campaign';
</script>

<div class="hero">
	<h1>Support DiasporaJunxion</h1>
	<p>
		Empowering Ghanaian artists, makers, and entrepreneurs to reach the diaspora and the world. Your
		support funds workshops, resources, and growth opportunities for these creative talents.
	</p>

	<div class="cta-buttons">
		<a class="gofundme" href={gofundmeUrl} target="_blank" rel="noopener noreferrer">
			Donate via GoFundMe
		</a>
		<a class="kickstarter" href={kickstarterUrl} target="_blank" rel="noopener noreferrer">
			Back on Kickstarter
		</a>
	</div>
</div>

<div class="impact-section">
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
</div>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 4rem 1rem;
		background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
	}

	.hero h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.hero p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		max-width: 600px;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.cta-buttons a {
		text-decoration: none;
		padding: 0.8rem 1.6rem;
		border-radius: 8px;
		font-weight: bold;
		transition: transform 0.2s;
	}

	.gofundme {
		background-color: #00b140;
		color: white;
	}

	.kickstarter {
		background-color: #1abc9c;
		color: white;
	}

	.cta-buttons a:hover {
		transform: scale(1.05);
	}

	.impact-section {
		padding: 4rem 1rem;
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}

	.impact-section h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.impact-section p {
		font-size: 1.1rem;
		margin-bottom: 2rem;
	}

	.impact-grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	}

	.impact-card {
		padding: 2rem;
		border-radius: 12px;
		background-color: #f8fafc;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
	}

	.impact-card h3 {
		margin-bottom: 0.5rem;
		font-size: 1.2rem;
	}

	.impact-card p {
		font-size: 1rem;
	}
</style>
