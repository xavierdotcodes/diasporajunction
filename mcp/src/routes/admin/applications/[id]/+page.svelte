<script>
	let { data, form } = $props();
	const app = data.application;
</script>

<main class="shell page">
	<h1>{app?.businessName}</h1>
	{#if form?.message}<p class="error">{form.message}</p>{/if}
	<section class="panel">
		<p>Status: <strong>{app?.status}</strong></p>
		<p>Payment: <strong>{app?.paymentStatus}</strong> {app?.paymentReference ?? ''}</p>
		<p>Contact: {app?.contactName} — {app?.email} — {app?.phone}</p>
		<p>Referral: {app?.referralCode ?? 'None'}</p>
		<p>{app?.description}</p>
	</section>
	<section class="panel">
		<h2>Public media</h2>
		<div class="preview-grid">
			{#each data.media ?? [] as item}
				<a href={item.url} target="_blank" rel="noreferrer">
					{#if item.url}
						<img src={item.url} alt={`${item.type} preview`} />
					{/if}
					<span>{item.type}</span>
				</a>
			{/each}
		</div>
	</section>
	<section class="panel">
		<h2>Verification documents</h2>
		<p class="muted">Admin-only previews. Do not share these links publicly.</p>
		{#each data.documents ?? [] as item}
			<div class="doc-row">
				<a href={item.url} target="_blank" rel="noreferrer">{item.document.type} preview</a>
				<p>Status: {item.document.status}</p>
				<form method="POST" action="?/documentStatus" class="actions">
					<input name="adminToken" placeholder="Admin action token" />
					<input type="hidden" name="documentId" value={item.document.id} />
					<select name="status">
						<option value="UNDER_REVIEW">Under review</option>
						<option value="ACCEPTED">Accepted</option>
						<option value="REJECTED">Rejected</option>
						<option value="NEEDS_RESUBMISSION">Needs resubmission</option>
					</select>
					<input name="notes" placeholder="Notes" />
					<button class="button secondary">Update document</button>
				</form>
			</div>
		{/each}
	</section>
	<form method="POST" action="?/note" class="panel actions">
		<input name="adminToken" placeholder="Admin action token" />
		<textarea name="adminNotes" placeholder="Admin note">{app?.adminNotes ?? ''}</textarea>
		<button class="button secondary">Add note</button>
	</form>
	<form method="POST" action="?/underReview" class="panel actions">
		<input name="adminToken" placeholder="Admin action token" />
		<button class="button secondary">Mark under review</button>
	</form>
	<form method="POST" action="?/resubmission" class="panel actions">
		<input name="adminToken" placeholder="Admin action token" />
		<textarea name="adminNotes" placeholder="Resubmission note" required></textarea>
		<button class="button secondary">Request resubmission</button>
	</form>
	<form method="POST" action="?/approve" class="panel actions">
		<input name="adminToken" placeholder="Admin action token" />
		<button class="button">Approve and convert</button>
	</form>
</main>

<style>
	.page { padding: 3rem 0; display:grid; gap:1rem; }
	.actions { display:grid; gap:.7rem; max-width:720px; }
	input, textarea { padding:.75rem; border:1px solid #d8d3c8; border-radius:.5rem; }
	select { padding:.75rem; border:1px solid #d8d3c8; border-radius:.5rem; }
	textarea { min-height:6rem; }
	.error { color:#a33020; }
	.preview-grid { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); }
	.preview-grid a { display:grid; gap:.45rem; }
	img { max-width:100%; border-radius:.5rem; border:1px solid #d8d3c8; }
	.doc-row { border-top:1px solid #d8d3c8; padding-top:1rem; margin-top:1rem; }
</style>
