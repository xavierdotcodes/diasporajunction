<script>
	import SubscribeModal from '$lib/components/lead/Subscribe.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('home.cta.component');

	let showModal = $state(false);

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}
</script>

<section class="cta-section" aria-labelledby="landing-cta-title">
	<div class="cta-shell">
		<div class="cta-copy">
			<p class="cta-label">Free Guide</p>
			<h2 id="landing-cta-title">Get a grounded starting point before you make a bigger move.</h2>
			<p class="cta-description">
				Get the free Ghana reality guide, then use it to think more clearly about visiting, relocating,
				and what life in Ghana might actually ask of you.
			</p>
		</div>

		<div class="cta-action-panel">
			<div class="cta-action-surface">
				<p class="cta-action-title">What you will get</p>
				<ul class="cta-list">
					<li>The free Ghana reality guide</li>
					<li>A calmer way to think through the move</li>
					<li>Short follow-up emails with practical next steps</li>
				</ul>
				<button type="button" class="cta-button" onclick={openModal}>Get the Free Guide</button>
				<p class="cta-footnote">Useful first. Then deeper only if you need it.</p>
			</div>
		</div>
	</div>

	{#if showModal}
		<SubscribeModal on:close={closeModal} />
	{/if}
</section>

<style>
	.cta-section {
		position: relative;
		padding: clamp(4.5rem, 7vw, 6.5rem) 1.5rem clamp(6rem, 8vw, 7rem);
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 24rem),
			radial-gradient(circle at bottom left, rgba(217, 4, 43, 0.18), transparent 22rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.cta-shell {
		display: grid;
		grid-template-columns: minmax(0, 1.08fr) minmax(18rem, 0.82fr);
		gap: clamp(1.6rem, 4vw, 4rem);
		align-items: center;
		width: min(100%, 78rem);
		margin: 0 auto;
	}

	.cta-copy {
		max-width: 42rem;
	}

	.cta-label {
		margin: 0 0 1rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.92);
	}

	.cta-copy h2 {
		margin: 0;
		font-size: clamp(2.2rem, 5vw, 4.3rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
		text-wrap: balance;
		color: #fff8ef;
	}

	.cta-description {
		margin: 1.35rem 0 0;
		font-size: clamp(1rem, 1.35vw, 1.16rem);
		line-height: 1.82;
		color: rgba(255, 248, 239, 0.8);
	}

	.cta-action-panel {
		display: flex;
		justify-content: flex-end;
	}

	.cta-action-surface {
		width: min(100%, 24rem);
		padding: 1.75rem;
		border-radius: 1.9rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 55%),
			linear-gradient(180deg, rgba(255, 248, 239, 0.98), rgba(245, 234, 211, 1));
		box-shadow:
			0 28px 58px rgba(0, 0, 0, 0.18),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		color: #111111;
	}

	.cta-action-title {
		margin: 0 0 1rem;
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.62);
	}

	.cta-list {
		list-style: none;
		display: grid;
		gap: 0.8rem;
		margin: 0;
		padding: 0;
	}

	.cta-list li {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		font-size: 0.98rem;
		line-height: 1.65;
		color: rgba(17, 17, 17, 0.82);
	}

	.cta-list li::before {
		content: '';
		display: inline-flex;
		flex: 0 0 auto;
		width: 0.55rem;
		height: 0.55rem;
		margin-top: 0.42rem;
		border-radius: 999px;
		background: #f2b705;
		box-shadow: 0 0 0 0.28rem rgba(242, 183, 5, 0.14);
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 3.5rem;
		margin-top: 1.4rem;
		padding: 0 1.3rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #d9042b, #b10323);
		color: white;
		font-size: 0.98rem;
		font-weight: 700;
		transition:
			transform 180ms ease,
			box-shadow 180ms ease,
			filter 180ms ease;
		box-shadow: 0 20px 40px rgba(95, 0, 18, 0.22);
	}

	.cta-button:hover {
		transform: translateY(-1px);
		filter: brightness(1.02);
	}

	.cta-footnote {
		margin: 0.95rem 0 0;
		font-size: 0.88rem;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.56);
	}

	@media (max-width: 960px) {
		.cta-shell {
			grid-template-columns: 1fr;
		}

		.cta-action-panel {
			justify-content: flex-start;
		}
	}

	@media (max-width: 768px) {
		.cta-section {
			padding-inline: 1rem;
		}

		.cta-action-surface {
			width: 100%;
			border-radius: 1.5rem;
		}

		.cta-description,
		.cta-list li {
			font-size: 0.98rem;
			line-height: 1.72;
		}
	}
</style>
