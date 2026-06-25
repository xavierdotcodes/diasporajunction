<script>
	let { data, form } = $props();
	let dashboard = $derived(data.dashboard ?? {});
	let listing = $derived(dashboard.listing ?? {});
	let completeness = $derived(dashboard.profileCompleteness ?? {});
	let counts = $derived(dashboard.interactionSummary30d?.counts ?? {});
	let suggestions = $derived(dashboard.improvementSuggestions?.improvementSuggestions ?? dashboard.improvementSuggestions);
	let digest = $derived(dashboard.leadDigest ?? {});
</script>

<main class="shell page">
	<header class="topline">
		<div>
			<h1>{listing.businessName}</h1>
			<p class="muted">{listing.isActive ? 'Active' : 'Inactive'} · {listing.verificationStatus} · {listing.isFeatured ? 'Featured' : 'Standard'}</p>
		</div>
		<div class="actions">
			<a class="button secondary" href={listing.profileUrl}>Public profile</a>
			<a class="button" href={`/dashboard/listings/${listing.id}/edit`}>Edit profile</a>
		</div>
	</header>

	{#if form?.message}<p class="notice">{form.message}</p>{/if}

	<section class="grid four">
		<div class="card metric"><span>Total 30d</span><strong>{dashboard.interactionSummary30d?.total ?? 0}</strong></div>
		<div class="card metric"><span>Search appearances</span><strong>{counts.searchResultShown ?? 0}</strong></div>
		<div class="card metric"><span>Profile views</span><strong>{counts.profileViews ?? 0}</strong></div>
		<div class="card metric"><span>Contact clicks</span><strong>{(counts.whatsappClicks ?? 0) + (counts.phoneClicks ?? 0) + (counts.emailClicks ?? 0) + (counts.websiteClicks ?? 0)}</strong></div>
	</section>

	<section class="grid two">
		<div class="card">
			<h2>Profile completeness</h2>
			<p class="score">{completeness.score ?? 0}%</p>
			<ul>
				{#each completeness.recommendedNextActions ?? [] as action}
					<li>{action}</li>
				{/each}
			</ul>
		</div>
		<div class="card">
			<h2>Lead digest</h2>
			<p>{digest.providerFacingSummary ?? digest.digestSummary}</p>
			<form method="POST" action="?/requestLeadDigest">
				<button class="button secondary" type="submit">Request new digest</button>
			</form>
		</div>
	</section>

	<section class="card">
		<div class="topline">
			<h2>AI profile suggestions</h2>
			<form method="POST" action="?/requestSuggestion">
				<button class="button secondary" type="submit">Request new suggestion</button>
			</form>
		</div>
		<p class="muted">AI output is a suggestion and does not change verification, payments, or admin decisions.</p>
		<ul>
			{#each suggestions?.profileImprovementSuggestions ?? suggestions?.recommendedNextActions ?? [] as item}
				<li>{item}</li>
			{/each}
		</ul>
	</section>

	<nav class="actions">
		<a class="button" href={`/dashboard/listings/${listing.id}/analytics`}>View analytics</a>
	</nav>
</main>

<style>
	.page { padding: 3rem 0; display:grid; gap:1.25rem; }
	.topline { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
	.actions { display:flex; gap:.6rem; flex-wrap:wrap; }
	.metric { display:grid; gap:.25rem; }
	.metric strong, .score { font-size:2rem; font-weight:900; margin:0; }
	.notice { color:#215f3a; }
</style>
