<script>
	import { tick, onMount } from 'svelte';
	import gsap from 'gsap';

	let showModal = false;

	function openModal() {
		showModal = true;
		tick().then(() => animateModalIn());
	}

	function closeModal() {
		animateModalOut().then(() => (showModal = false));
	}

	function animateModalIn() {
		gsap.fromTo(
			'.modal-content',
			{ y: -50, opacity: 0, scale: 0.95 },
			{ y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
		);
	}

	function animateModalOut() {
		return gsap
			.to('.modal-content', {
				y: -50,
				opacity: 0,
				scale: 0.95,
				duration: 0.4,
				ease: 'power2.in'
			})
			.then();
	}

	async function handleSubmit(event) {
		event.preventDefault();
		// API submission here
		alert('Registration submitted!');
		closeModal();
	}
</script>

<div class="page">
	<!-- HERO -->
	<section class="section hero" style="text-align:center;">
		<h1>NDGO Program</h1>
		<p>Transform your skills, career, and life with our hands-on NDGO program.</p>
		<button
			class="cta"
			on:click={() => document.getElementById('details').scrollIntoView({ behavior: 'smooth' })}
		>
			Learn More
		</button>
	</section>

	<!-- DETAILS -->
	<section class="section" id="details">
		<h2>About NDGO</h2>
		<p>
			NDGO is a structured program that empowers participants to acquire practical skills, network
			with peers, and achieve measurable growth in their careers and personal development.
		</p>

		<h3>How It Works</h3>
		<ul>
			<li>Step 1: Orientation and goal setting with mentors.</li>
			<li>Step 2: Hands-on project work to reinforce learning.</li>
			<li>Step 3: Review and feedback sessions to track progress.</li>
		</ul>

		<h3>Benefits</h3>
		<ul>
			<li>Real-world skills that can be applied immediately.</li>
			<li>Personalized mentorship from industry experts.</li>
			<li>Networking opportunities with a like-minded cohort.</li>
		</ul>

		<div style="text-align:center; margin-top:2rem;">
			<button class="cta" on:click={openModal}>Register Now</button>
		</div>
	</section>
</div>

<!-- MODAL -->
{#if showModal}
	<div class="modal" on:click={closeModal}>
		<div class="modal-content" on:click|stopPropagation>
			<h2>Register for NDGO</h2>
			<form on:submit={handleSubmit}>
				<input type="text" placeholder="Full Name" required />
				<input type="email" placeholder="Email Address" required />
				<button type="submit" class="cta">Submit</button>
			</form>
			<button class="close" on:click={closeModal}>Close</button>
		</div>
	</div>
{/if}

<style>
	/* GENERAL PAGE STYLING */
	.page {
		padding: 2rem 1rem;
		max-width: 900px;
		margin: auto;
		font-family: 'Inter', sans-serif;
		color: #111;
	}

	h1,
	h2,
	h3 {
		font-weight: 700;
		margin-bottom: 1rem;
	}

	p,
	li {
		line-height: 1.6;
		margin-bottom: 0.75rem;
	}

	ul {
		list-style: disc;
		padding-left: 1.5rem;
	}

	.section {
		margin-bottom: 3rem;
	}

	button.cta {
		background: linear-gradient(90deg, #ffd700, #ffb800);
		padding: 0.9rem 2rem;
		border-radius: 12px;
		font-weight: 600;
		color: #111;
		cursor: pointer;
		border: none;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}
	button.cta:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	}

	/* MODAL STYLING */
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 1000;
	}

	.modal-content {
		background: #fff;
		padding: 2rem;
		border-radius: 16px;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
	}

	.modal-content h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.modal-content form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 1px solid #ccc;
		font-size: 1rem;
	}

	.modal-content button.close {
		background: none;
		border: none;
		margin-top: 1rem;
		color: #666;
		cursor: pointer;
		font-size: 0.9rem;
		text-align: center;
	}

	/* RESPONSIVE */
	@media (min-width: 640px) {
		.page {
			padding: 3rem 2rem;
		}
	}
</style>
