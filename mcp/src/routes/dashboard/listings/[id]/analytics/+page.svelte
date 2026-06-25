<script>
	let { data } = $props();
	let listing = $derived(data.dashboard?.listing ?? {});
	let counts = $derived(data.summary?.counts ?? {});
	let types = $derived(data.summary?.topInteractionTypes ?? []);
</script>

<main class="shell page">
	<header class="topline">
		<div>
			<h1>Analytics</h1>
			<p class="muted">{listing.businessName}</p>
		</div>
		<nav class="periods" aria-label="Analytics period">
			<a class:active={data.period === '7d'} href="?period=7d">7 days</a>
			<a class:active={data.period === '30d'} href="?period=30d">30 days</a>
			<a class:active={data.period === 'all'} href="?period=all">All time</a>
		</nav>
	</header>

	<section class="grid four">
		<div class="card metric"><span>Total views</span><strong>{(counts.views ?? 0) + (counts.profileViews ?? 0)}</strong></div>
		<div class="card metric"><span>Search appearances</span><strong>{counts.searchResultShown ?? 0}</strong></div>
		<div class="card metric"><span>WhatsApp clicks</span><strong>{counts.whatsappClicks ?? 0}</strong></div>
		<div class="card metric"><span>Quote requests</span><strong>{counts.quoteRequests ?? 0}</strong></div>
	</section>

	<section class="grid four">
		<div class="card metric"><span>Phone clicks</span><strong>{counts.phoneClicks ?? 0}</strong></div>
		<div class="card metric"><span>Email clicks</span><strong>{counts.emailClicks ?? 0}</strong></div>
		<div class="card metric"><span>Website clicks</span><strong>{counts.websiteClicks ?? 0}</strong></div>
		<div class="card metric"><span>Profile views</span><strong>{counts.profileViews ?? 0}</strong></div>
	</section>

	<section class="grid two">
		<div class="card">
			<h2>Top interaction types</h2>
			<ul>
				{#each types as item}
					<li>{item.type}: {item.count}</li>
				{/each}
			</ul>
		</div>
		<div class="card">
			<h2>Recent timeline</h2>
			<ul>
				{#each data.recentInteractions ?? [] as item}
					<li>{item.type} · {new Date(item.createdAt).toLocaleString()}</li>
				{/each}
			</ul>
		</div>
	</section>
</main>

<style>
	.page { padding:3rem 0; display:grid; gap:1.25rem; }
	.topline { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
	.periods { display:flex; gap:.5rem; flex-wrap:wrap; }
	.periods a { padding:.45rem .7rem; border:1px solid #d8d3c8; border-radius:.4rem; text-decoration:none; }
	.periods a.active { background:#1c3b2b; color:white; border-color:#1c3b2b; }
	.metric { display:grid; gap:.25rem; }
	.metric strong { font-size:2rem; font-weight:900; }
</style>
