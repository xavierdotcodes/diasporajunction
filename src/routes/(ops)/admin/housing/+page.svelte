<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('admin.housing.page');

	let { data, form } = $props();

	function imageListText(images) {
		return images.map((image) => image.url).join('\n');
	}

	function formatStatus(status) {
		return String(status || '').replaceAll('_', ' ');
	}

	function formatDate(value) {
		if (!value) return 'Not yet';
		return new Date(value).toLocaleDateString();
	}

	const listingMetrics = $derived(
		data.listings.reduce(
			(metrics, listing) => {
				metrics.total += 1;
				if (listing.status === 'PENDING_REVIEW') metrics.pendingReview += 1;
				if (listing.status === 'PUBLISHED') metrics.published += 1;
				if (listing.featured) metrics.featured += 1;
				return metrics;
			},
			{
				total: 0,
				pendingReview: 0,
				published: 0,
				featured: 0
			}
		)
	);
</script>

<section class="housing-admin-page">
	<div class="shell">
		<header class="page-header">
			<div>
				<p class="eyebrow">Housing Ops</p>
				<h1>Review submitted housing listings and inquiries.</h1>
				<p class="copy">
					This stays intentionally lean. Owners build and pay on their side. You review, publish,
					feature, archive, and track inquiries here.
				</p>
			</div>
		</header>

		<section class="overview-grid">
			<article class="overview-card">
				<p class="card-kicker">Listings Snapshot</p>
				<div class="metric-grid">
					<div>
						<strong>{listingMetrics.total}</strong>
						<span>Total listings</span>
					</div>
					<div>
						<strong>{listingMetrics.pendingReview}</strong>
						<span>Pending review</span>
					</div>
					<div>
						<strong>{listingMetrics.published}</strong>
						<span>Published</span>
					</div>
					<div>
						<strong>{listingMetrics.featured}</strong>
						<span>Featured</span>
					</div>
				</div>
			</article>

			<article class="overview-card">
				<p class="card-kicker">Inquiry Snapshot</p>
				<div class="metric-grid">
					<div>
						<strong>{data.inquiries.length}</strong>
						<span>Recent inquiries</span>
					</div>
					<div>
						<strong>{data.inquiries.filter((inquiry) => inquiry.moveTimeline).length}</strong>
						<span>With move timeline</span>
					</div>
				</div>
				<p class="overview-copy">
					Use the listing column to moderate submissions. Use the inquiry column to see who is
					reaching out and which listing is attracting attention.
				</p>
			</article>
		</section>

		{#if form?.error}
			<p class="status error">{form.error}</p>
		{/if}

		{#if form?.success}
			<p class="status success">{form.success}</p>
		{/if}

		<section class="admin-grid">
			<div class="admin-card">
				<div class="section-header">
					<div>
						<p class="card-kicker">Listing Moderation</p>
						<h2>Listings</h2>
					</div>
				</div>

				<div class="stack">
					{#if data.listings.length === 0}
						<p class="muted">No housing listings yet.</p>
					{:else}
						{#each data.listings as listing}
							<details class="listing-item">
								<summary>
									<div class="summary-copy">
										<strong>{listing.title}</strong>
										<p>{listing.location}{listing.neighborhood ? `, ${listing.neighborhood}` : ''}</p>
										<p class="small">
											Owner: {listing.ownerName || 'Unknown'}{listing.ownerEmail ? ` · ${listing.ownerEmail}` : ''}
										</p>
									</div>

									<div class="summary-meta">
										<span>{formatStatus(listing.status)}</span>
										<span>{listing._count.inquiries} inquiries</span>
										{#if listing.featured}
											<span>Featured</span>
										{/if}
									</div>
								</summary>

								<div class="listing-details">
									<div class="detail-grid">
										<div class="detail-card">
											<p class="small-label">Summary</p>
											<p>{listing.summary}</p>
										</div>
										<div class="detail-card">
											<p class="small-label">Description</p>
											<p>{listing.description}</p>
										</div>
										{#if listing.diasporaFriendlyNotes}
											<div class="detail-card">
												<p class="small-label">Diaspora notes</p>
												<p>{listing.diasporaFriendlyNotes}</p>
											</div>
										{/if}
										<div class="detail-card">
											<p class="small-label">Ops facts</p>
											<p>Updated: {formatDate(listing.updatedAt)}</p>
											<p>Submitted: {formatDate(listing.submittedAt)}</p>
											<p>Paid: {formatDate(listing.paidAt)}</p>
											<p>Last payment: {listing.payments[0]?.status || 'None'}</p>
										</div>
										<div class="detail-card full-span">
											<p class="small-label">Images</p>
											<p>{imageListText(listing.images) || 'No images uploaded'}</p>
										</div>
										{#if listing.moderationNotes}
											<div class="detail-card full-span">
												<p class="small-label">Current moderation notes</p>
												<p>{listing.moderationNotes}</p>
											</div>
										{/if}
									</div>

									<div class="link-row">
										{#if listing.slug}
											<a href={`/housing/listings/${listing.slug}`} target="_blank" rel="noreferrer">
												Open public listing
											</a>
										{/if}
										<a href={`/housing/owners/listings/${listing.id}`} target="_blank" rel="noreferrer">
											Open owner draft
										</a>
									</div>
								</div>

								<form method="POST" action="?/moderate" class="moderation-form">
									<input type="hidden" name="id" value={listing.id} />

									<label>
										<span>Status</span>
										<select name="status" value={listing.status}>
											<option value="DRAFT">Draft</option>
											<option value="PENDING">Pending</option>
											<option value="PAYMENT_PENDING">Payment pending</option>
											<option value="PENDING_REVIEW">Pending review</option>
											<option value="PUBLISHED">Published</option>
											<option value="ARCHIVED">Archived</option>
										</select>
									</label>

									<label class="checkbox">
										<input type="checkbox" name="featured" checked={listing.featured} />
										<span>Featured</span>
									</label>

									<label class="full">
										<span>Moderation notes</span>
										<textarea name="moderationNotes" rows="4">{listing.moderationNotes ?? ''}</textarea>
									</label>

									<div class="full actions">
										<button type="submit">Save Moderation</button>
									</div>
								</form>
							</details>
						{/each}
					{/if}
				</div>
			</div>

			<div class="admin-card">
				<div class="section-header">
					<div>
						<p class="card-kicker">Inquiry Review</p>
						<h2>Recent inquiries</h2>
					</div>
				</div>

				<div class="stack inquiries">
					{#if data.inquiries.length === 0}
						<p class="muted">No housing inquiries yet.</p>
					{:else}
						{#each data.inquiries as inquiry}
							<article class="inquiry-item">
								<div class="inquiry-head">
									<div>
										<strong>{inquiry.listing.title}</strong>
										<p>{inquiry.requesterEmail}</p>
										{#if inquiry.listing.ownerEmail}
											<p class="small">Owner contact on file: {inquiry.listing.ownerEmail}</p>
										{/if}
									</div>
									<span>{formatDate(inquiry.createdAt)}</span>
								</div>

								<div class="inquiry-meta">
									{#if inquiry.requesterName}
										<p><strong>Name:</strong> {inquiry.requesterName}</p>
									{/if}
									{#if inquiry.requesterPhone}
										<p><strong>Phone:</strong> {inquiry.requesterPhone}</p>
									{/if}
									{#if inquiry.moveTimeline}
										<p><strong>Timeline:</strong> {inquiry.moveTimeline}</p>
									{/if}
									<p><strong>Listing:</strong> {inquiry.listing.location}</p>
								</div>

								<div class="message-card">
									<p class="small-label">Message</p>
									<p>{inquiry.message}</p>
								</div>

								<div class="link-row">
									<a href={`/housing/listings/${inquiry.listing.slug}`} target="_blank" rel="noreferrer">
										Open listing
									</a>
								</div>
							</article>
						{/each}
					{/if}
				</div>
			</div>
		</section>
	</div>
</section>

<style>
	.housing-admin-page {
		padding: 2rem 0 4rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.shell {
		width: min(100%, 82rem);
		margin: 0 auto;
		padding: 0 1.25rem;
	}

	.page-header h1,
	.admin-card h2 {
		margin: 0;
		letter-spacing: -0.04em;
	}

	.eyebrow,
	.card-kicker,
	.small-label {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.eyebrow {
		color: rgba(217, 4, 43, 0.82);
	}

	.card-kicker,
	.small-label {
		color: rgba(17, 17, 17, 0.56);
	}

	.copy,
	.muted,
	.overview-copy {
		margin: 0.85rem 0 0;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.72);
	}

	.status {
		margin-top: 1rem;
		font-weight: 700;
	}

	.status.success {
		color: #026b1d;
	}

	.status.error {
		color: #b10323;
	}

	.overview-grid,
	.admin-grid,
	.moderation-form,
	.metric-grid,
	.detail-grid,
	.inquiry-meta {
		display: grid;
		gap: 1rem;
	}

	.overview-card,
	.admin-card {
		margin-top: 1.25rem;
		padding: 1.4rem;
		border-radius: 1.8rem;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 20px 48px rgba(17, 17, 17, 0.1);
	}

	.metric-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin-top: 1rem;
	}

	.metric-grid div,
	.detail-card,
	.message-card {
		padding: 1rem;
		border-radius: 1.2rem;
		background: #faf5e5;
	}

	.metric-grid strong {
		display: block;
		font-size: 2rem;
		line-height: 1;
		letter-spacing: -0.06em;
	}

	.metric-grid span {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(17, 17, 17, 0.58);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: end;
	}

	.stack {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.listing-item {
		border-radius: 1.4rem;
		border: 1px solid rgba(17, 17, 17, 0.08);
		padding: 1rem;
		background: #faf5e5;
	}

	summary {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		cursor: pointer;
		list-style: none;
	}

	strong,
	p {
		margin: 0;
	}

	p {
		margin-top: 0.35rem;
		color: rgba(17, 17, 17, 0.72);
	}

	.small {
		font-size: 0.86rem;
	}

	.summary-copy {
		min-width: 0;
	}

	.summary-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.35rem;
	}

	.summary-meta span {
		display: inline-flex;
		align-items: center;
		min-height: 1.9rem;
		padding: 0 0.75rem;
		border-radius: 999px;
		background: white;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.listing-details {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.full-span {
		grid-column: 1 / -1;
	}

	.link-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.link-row a {
		color: #026b1d;
		font-weight: 700;
		text-decoration: none;
	}

	label {
		display: grid;
		gap: 0.45rem;
	}

	label span {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.58);
	}

	select,
	textarea,
	button {
		border-radius: 1rem;
		border: 1px solid rgba(17, 17, 17, 0.12);
		background: white;
		padding: 0.85rem 1rem;
	}

	.full {
		grid-column: 1 / -1;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	.checkbox input {
		width: auto;
	}

	.actions button {
		min-height: 3rem;
		border-radius: 999px;
		border: 0;
		background: #111111;
		color: white;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}

	.inquiry-item {
		padding: 1rem;
		border-radius: 1.4rem;
		background: #faf5e5;
	}

	.inquiry-head {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: start;
	}

	@media (min-width: 960px) {
		.overview-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.admin-grid {
			grid-template-columns: minmax(0, 1.15fr) minmax(19rem, 0.85fr);
			align-items: start;
		}

		.moderation-form {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.detail-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
