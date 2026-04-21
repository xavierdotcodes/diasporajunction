<script>
	import Nav from '$lib/components/community/Nav.svelte';
	import Tool from '$lib/components/community/Tool.svelte';
	import Vault from '$lib/components/community/Vault.svelte';
	import AccessCardGrid from '$lib/components/shared/AccessCardGrid.svelte';
	import CommunityFeatureBuckets from '$lib/components/shared/CommunityFeatureBuckets.svelte';
	import CommunityFeedSection from '$lib/components/shared/CommunityFeedSection.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('premium.community.portal.page');

	let { data } = $props();

	const memberQuickActions = [
		{
			eyebrow: 'Start',
			title: 'Check Pulse',
			description:
				'Begin with what is happening now before you go deeper into directories, archives, or tools.',
			access: 'Gated',
			accent: 'red'
		},
		{
			eyebrow: 'Then',
			title: 'Use Access',
			description:
				'Move into trusted pathways once you know whether your question is about housing, family, local navigation, or setup.',
			access: 'Gated',
			accent: 'gold'
		},
		{
			eyebrow: 'When Needed',
			title: 'Ask / Connect',
			description:
				'Use the relational layer when the answer depends on timing, nuance, or a real person rather than a static page.',
			access: 'Gated',
			accent: 'green'
		}
	];
</script>

<svelte:head>
	<title>Community Portal | DiasporaJunxion</title>
	<meta
		name="description"
		content="The member-only DiasporaJunxion workspace for premium content, tools, resources, and deeper support."
	/>
</svelte:head>

<div class="community-page member-mode">
	<section class="community-hero hero-dark">
		<div class="community-shell hero-grid">
			<div class="hero-copy">
				<p class="eyebrow light">Member Portal</p>
				<h1>Welcome inside the deeper layer.</h1>
				<p>
					This is where DiasporaJunxion becomes more current, more relational, and more useful for
					real decisions. The public site orients. Community helps you move with sharper context.
				</p>
			</div>

			<div class="hero-panel">
				<p class="panel-kicker">Access Status</p>
				<ul>
					<li>Signed in as {data.user?.email ?? data.communityViewer.email ?? 'member'}</li>
					<li>Community access is active on this account</li>
					<li>Use Pulse first, then move into resources, tools, and deeper support</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="community-section section-cream">
		<div class="community-shell">
			<SectionHeader
				eyebrow="Member Workspace"
				title="The paid layer is organized as a usable workspace, not just a hidden archive."
				description="Move through the portal by current signals first, then into premium resources, tools, and the relational layer."
			/>

			<div class="spacer-lg"></div>
			<Nav items={data.portalContent.memberWorkspaceLinks} />

			<div class="spacer-xl"></div>

			<SectionHeader
				eyebrow="Member Areas"
				title="The portal is organized around what becomes more valuable when it stays current and relational."
				description="These buckets now sit inside a clearer member structure so the portal behaves more like a paid operating layer and less like a generic placeholder."
			/>

			<div class="spacer-lg"></div>
			<CommunityFeatureBuckets buckets={data.portalContent.memberBuckets} />
		</div>
	</section>

	<section id="pulse" class="community-section section-dark">
		<div class="community-shell">
			<CommunityFeedSection
				eyebrow="Pulse"
				title="Start with what is happening now."
				description="Pulse is the front door to the member layer because context loses value quickly when it goes stale."
				tone="dark"
				entries={data.portalContent.pulseEntries}
			/>
		</div>
	</section>

	<section id="resources" class="community-section section-cream">
		<div class="community-shell">
			<SectionHeader
				eyebrow="Resource Vault"
				title="Premium resources live here because they are more useful when they stay contextual."
				description="This layer holds planning packs, field notes, and decision frameworks that should not be reduced to generic public blog content."
			/>

			<div class="spacer-lg"></div>
			<Vault items={data.portalContent.resourceVaultItems} />

			<div class="spacer-xl"></div>

			<div id="access">
				<CommunityFeedSection
					eyebrow="Access"
					title="Use trusted pathways when the question becomes practical."
					description="This is where members move from public orientation into useful contacts, referral logic, and more grounded next steps."
					entries={data.portalContent.accessEntries}
				/>
			</div>

			<div class="spacer-xl"></div>

			<div id="lived-intelligence">
				<CommunityFeedSection
					eyebrow="Lived Intelligence"
					title="Read the move through actual experience, not polished fantasy."
					description="Stories, field notes, and first-phase realities help members interpret their own season with more honesty."
					entries={data.portalContent.livedIntelligenceEntries}
				/>
			</div>
		</div>
	</section>

	<section id="tools" class="community-section section-dark">
		<div class="community-shell">
			<div class="tool-grid">
				<div>
					<SectionHeader
						eyebrow="Tool Lab"
						title="Use structured support when the move stops being abstract."
						description="Community tools are meant to help members move from vague intent into clearer sequencing, better family decisions, and more realistic next steps."
						tone="dark"
					/>

					<div class="spacer-lg"></div>
					<Tool />
				</div>

				<div class="tool-copy-card">
					<p class="tool-copy-kicker">Why This Matters</p>
					<h3>Tools should narrow uncertainty, not perform sophistication.</h3>
					<p>
						Public content can explain the landscape. Member tools should help you decide what
						phase you are in, what still needs clarity, and where support matters most.
					</p>
					<ul>
						<li>Clarify visit vs trial stay vs relocation</li>
						<li>See where family planning needs more support</li>
						<li>Use checklists before momentum starts pretending to be readiness</li>
					</ul>
				</div>
			</div>

			<div class="spacer-xl"></div>

			<CommunityFeedSection
				eyebrow="Tools"
				title="Structured support for the decisions that stop being simple."
				description="These entries now sit beside a live member tool so the portal starts behaving like a real workspace instead of a content dump."
				tone="dark"
				entries={data.portalContent.toolsEntries}
			/>

			<div class="spacer-xl"></div>

			<div id="ask-connect">
				<CommunityFeedSection
					eyebrow="Ask / Connect"
					title="The member layer should eventually be relational, not just informational."
					description="This is where future office-hours, question intake, and member-to-member support structures begin to take shape."
					tone="dark"
					entries={data.portalContent.askConnectEntries}
				/>
			</div>
		</div>
	</section>

	<section class="community-section section-cream">
		<div class="community-shell">
			<SectionHeader
				eyebrow="How To Use It"
				title="Start with the live layer, then move into the support layer."
				description="This keeps Community from becoming a random content vault. Members should feel where to begin, where to deepen, and where to ask for help."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={memberQuickActions} />
		</div>
	</section>

	<section class="community-section section-dark">
		<div class="community-shell">
			<StrategicCta
				eyebrow="Portal Status"
				title="Community is now a paid member layer, not just a gated promise."
				description="Use the public site to orient, use this space to work through deeper questions, and use the ebook when you need a tighter family-specific planning layer."
				primaryHref="/ebook"
				primaryLabel="See The Ebook"
				secondaryHref="/guides"
				secondaryLabel="Browse Public Guides"
			/>
		</div>
	</section>
</div>

<style>
	.community-page {
		background: #f8f2df;
		color: #111111;
	}

	.community-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.community-section {
		padding: clamp(4.75rem, 7vw, 6.5rem) 0;
	}

	.section-cream {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.section-dark,
	.hero-dark {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 24rem),
			radial-gradient(circle at bottom right, rgba(217, 4, 43, 0.1), transparent 26rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.community-hero {
		padding: clamp(5rem, 8vw, 7rem) 0 4.25rem;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(19rem, 0.72fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: end;
	}

	.hero-copy h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.4rem, 5vw, 4.8rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.hero-copy p:not(.eyebrow) {
		margin: 1.15rem 0 0;
		font-size: clamp(1rem, 1.3vw, 1.14rem);
		line-height: 1.8;
		color: rgba(255, 248, 239, 0.8);
	}

	.eyebrow.light {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.9);
	}

	.hero-panel {
		padding: 1.45rem;
		border-radius: 1.8rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.16), transparent 58%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
		backdrop-filter: blur(12px);
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.16);
	}

	.panel-kicker {
		margin: 0 0 0.85rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.9);
	}

	.hero-panel ul {
		display: grid;
		gap: 0.8rem;
		margin: 0;
		padding-left: 1rem;
	}

	.hero-panel li {
		font-size: 0.96rem;
		line-height: 1.65;
	}

	.spacer-lg {
		height: 2rem;
	}

	.spacer-xl {
		height: 3rem;
	}

	.tool-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(18rem, 0.52fr);
		gap: 1.25rem;
		align-items: start;
	}

	.tool-copy-card {
		padding: 1.35rem;
		border-radius: 1.6rem;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
		box-shadow: 0 20px 42px rgba(0, 0, 0, 0.14);
	}

	.tool-copy-kicker {
		margin: 0 0 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.88);
	}

	.tool-copy-card h3 {
		margin: 0;
		font-size: clamp(1.45rem, 2.5vw, 2.1rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: #fff8ef;
	}

	.tool-copy-card p,
	.tool-copy-card li {
		font-size: 0.96rem;
		line-height: 1.72;
		color: rgba(255, 248, 239, 0.78);
	}

	.tool-copy-card ul {
		display: grid;
		gap: 0.75rem;
		padding-left: 1.15rem;
		margin: 1rem 0 0;
	}

	@media (max-width: 960px) {
		.community-shell {
			padding-inline: 1rem;
		}

		.hero-grid,
		.tool-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
