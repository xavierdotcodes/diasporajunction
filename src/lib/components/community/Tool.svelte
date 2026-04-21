<script>
	const groups = [
		{
			title: 'Family reality',
			items: [
				'We know whether this is a visit, trial stay, or real relocation conversation.',
				'We have named the family support systems that need to feel stable.',
				'We understand which child-related decisions cannot wait until arrival.'
			]
		},
		{
			title: 'Daily-life setup',
			items: [
				'We have thought beyond inspiration and into housing, transport, money flow, and routine.',
				'We know what needs to be lined up before landing versus after arrival.',
				'We can name the friction points that would most destabilize the move.'
			]
		},
		{
			title: 'Belonging and support',
			items: [
				'We have a plan for connection, not just logistics.',
				'We know what questions still need lived intelligence instead of generic content.',
				'We know when to use Community instead of trying to figure it all out in public.'
			]
		}
	];

	let selected = $state(new Set());

	function toggleItem(key) {
		const next = new Set(selected);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		selected = next;
	}

	const totalItems = groups.reduce((count, group) => count + group.items.length, 0);
	const completed = $derived(selected.size);
	const completionLabel = $derived(`${completed} of ${totalItems} checkpoints complete`);
</script>

<section class="tool-panel" aria-labelledby="readiness-tool-title">
	<div class="tool-head">
		<div>
			<p class="tool-kicker">Member Tool</p>
			<h3 id="readiness-tool-title">Relocation readiness check</h3>
		</div>
		<p class="tool-progress">{completionLabel}</p>
	</div>

	<div class="tool-groups">
		{#each groups as group}
			<section class="tool-group">
				<h4>{group.title}</h4>
				<div class="tool-items">
					{#each group.items as item, index}
						<label class="tool-item">
							<input
								type="checkbox"
								checked={selected.has(`${group.title}-${index}`)}
								onchange={() => toggleItem(`${group.title}-${index}`)}
							/>
							<span>{item}</span>
						</label>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</section>

<style>
	.tool-panel {
		padding: 1.5rem;
		border-radius: 1.85rem;
		background:
			radial-gradient(circle at top right, rgba(3, 140, 37, 0.16), transparent 50%),
			linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		color: #111111;
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.08);
	}

	.tool-head {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
	}

	.tool-kicker {
		margin: 0 0 0.55rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(3, 140, 37, 0.88);
	}

	h3,
	h4 {
		margin: 0;
	}

	h3 {
		font-size: clamp(1.55rem, 2.6vw, 2.3rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
	}

	.tool-progress {
		margin: 0;
		font-size: 0.92rem;
		font-weight: 700;
		color: rgba(17, 17, 17, 0.62);
	}

	.tool-groups {
		display: grid;
		gap: 1rem;
		margin-top: 1.25rem;
	}

	.tool-group {
		padding: 1.1rem;
		border-radius: 1.3rem;
		background: rgba(255, 255, 255, 0.66);
	}

	h4 {
		font-size: 1.05rem;
		letter-spacing: -0.02em;
	}

	.tool-items {
		display: grid;
		gap: 0.8rem;
		margin-top: 0.85rem;
	}

	.tool-item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.75rem;
		align-items: start;
		font-size: 0.95rem;
		line-height: 1.65;
		color: rgba(17, 17, 17, 0.78);
		cursor: pointer;
	}

	input {
		margin-top: 0.18rem;
		accent-color: #038c25;
	}
	@media (max-width: 768px) {
		.tool-panel {
			padding: 1.2rem;
		}
	}
</style>
