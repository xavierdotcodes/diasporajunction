<script>
	import HousingOwnerListingPreview from '$lib/components/housing/HousingOwnerListingPreview.svelte';
	import { uploadHousingImages } from '$lib/client/housing';
	import Button from '$lib/components/ui/Button.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('housing.owner.editor.component');

	let { listing, viewer, ownerListingFeeUsd, form, checkoutResult } = $props();

	let initialized = $state(false);
	let title = $state('');
	let slug = $state('');
	let summary = $state('');
	let description = $state('');
	let listingType = $state('APARTMENT');
	let stayType = $state('LONG_STAY');
	let priceAmount = $state('');
	let currency = $state('USD');
	let pricePeriod = $state('month');
	let location = $state('');
	let neighborhood = $state('');
	let bedrooms = $state('');
	let bathrooms = $state('');
	let furnished = $state(false);
	let familyFriendly = $state(false);
	let availabilityText = $state('');
	let contactMethod = $state('DiasporaJunxion inquiry form');
	let inquiryDestination = $state('DiasporaJunxion manual follow-up');
	let providerName = $state('');
	let diasporaFriendlyNotes = $state('');
	let ownerName = $state('');
	let ownerPhone = $state('');
	let images = $state([]);
	let uploadError = $state('');
	let uploadLoading = $state(false);

	$effect(() => {
		if (initialized) return;

		title = listing.title || '';
		slug = listing.slug || '';
		summary = listing.summary || '';
		description = listing.description || '';
		listingType = listing.listingType || 'APARTMENT';
		stayType = listing.stayType || 'LONG_STAY';
		priceAmount = listing.priceAmount ?? '';
		currency = listing.currency || 'USD';
		pricePeriod = listing.pricePeriod || 'month';
		location = listing.location || '';
		neighborhood = listing.neighborhood || '';
		bedrooms = listing.bedrooms ?? '';
		bathrooms = listing.bathrooms ?? '';
		furnished = Boolean(listing.furnished);
		familyFriendly = Boolean(listing.familyFriendly);
		availabilityText = listing.availabilityText || '';
		contactMethod = listing.contactMethod || 'DiasporaJunxion inquiry form';
		inquiryDestination = listing.inquiryDestination || 'DiasporaJunxion manual follow-up';
		providerName = listing.providerName || '';
		diasporaFriendlyNotes = listing.diasporaFriendlyNotes || '';
		ownerName = listing.ownerName || viewer.firstName || '';
		ownerPhone = listing.ownerPhone || '';
		images = (listing.images || []).map((image, index) => ({
			url: image.url,
			storagePath: image.storagePath || null,
			alt: image.alt || '',
			sortOrder: index
		}));
		initialized = true;
	});

	const readinessChecks = $derived([
		{
			label: 'Title, summary, and description',
			complete: Boolean(title.trim() && summary.trim() && description.trim())
		},
		{
			label: 'Location and pricing basics',
			complete: Boolean(location.trim() && String(priceAmount).trim())
		},
		{
			label: 'At least one image uploaded',
			complete: images.length > 0
		},
		{
			label: 'Owner contact details added',
			complete: Boolean(ownerName.trim() && ownerPhone.trim())
		}
	]);

	const readyCount = $derived(readinessChecks.filter((check) => check.complete).length);
	const submitDisabled = $derived(listing.status === 'PENDING_REVIEW' || listing.status === 'PUBLISHED');
	const isReadyToSubmit = $derived(readyCount === readinessChecks.length);

	const previewListing = $derived({
		id: listing.id,
		slug,
		title,
		summary,
		description,
		listingType,
		stayType,
		priceAmount: priceAmount ? Number(priceAmount) : null,
		currency,
		pricePeriod,
		location,
		neighborhood,
		bedrooms: bedrooms ? Number(bedrooms) : null,
		bathrooms: bathrooms ? Number(bathrooms) : null,
		furnished,
		familyFriendly,
		availabilityText,
		contactMethod,
		inquiryDestination,
		providerName,
		diasporaFriendlyNotes,
		images
	});

	function normalizeImages(nextImages) {
		return nextImages.map((image, index) => ({
			...image,
			sortOrder: index
		}));
	}

	function removeImage(index) {
		images = normalizeImages(images.filter((_, currentIndex) => currentIndex !== index));
	}

	function moveImage(index, direction) {
		const target = index + direction;
		if (target < 0 || target >= images.length) return;

		const nextImages = [...images];
		[nextImages[index], nextImages[target]] = [nextImages[target], nextImages[index]];
		images = normalizeImages(nextImages);
	}

	async function handleImageUpload(event) {
		uploadError = '';
		const files = event.currentTarget.files;

		if (!files?.length) return;

		try {
			uploadLoading = true;
			const uploaded = await uploadHousingImages({
				files,
				listingId: listing.id,
				supabaseUserId: viewer.supabaseUserId
			});

			images = normalizeImages([...images, ...uploaded].slice(0, 10));
			event.currentTarget.value = '';
		} catch (error) {
			uploadError = error.message || 'Could not upload your listing images.';
		} finally {
			uploadLoading = false;
		}
	}
</script>

<div class="editor-grid">
	<form method="POST" class="editor-card">
		<div class="topbar">
			<a class="back-link" href="/housing/owners">Back to Owner Portal</a>
			<div class="status-chip">{listing.status.replaceAll('_', ' ')}</div>
		</div>

		<div class="header">
			<div>
				<p class="eyebrow">Owner Portal</p>
				<h1>Edit your property listing</h1>
				<p class="copy">
					Build the listing first. When it reads clearly, pay the small submission fee and send it for
					review.
				</p>
			</div>
		</div>

		{#if form?.error}
			<p class="status error">{form.error}</p>
		{/if}

		{#if form?.success}
			<p class="status success">{form.success}</p>
		{/if}

		{#if checkoutResult?.status === 'success'}
			<p class="status success">Payment confirmed. Your listing is now waiting for review.</p>
		{:else if checkoutResult?.status === 'canceled'}
			<p class="status error">Checkout was canceled. Your draft is still here.</p>
		{:else if checkoutResult?.status === 'error'}
			<p class="status error">We could not confirm the Stripe return for this listing yet.</p>
		{/if}

		<input type="hidden" name="imagesPayload" value={JSON.stringify(images)} />

		<div class="submission-card">
			<div>
				<p class="section-kicker">Submission Progress</p>
				<h2>{readyCount} of {readinessChecks.length} core steps complete</h2>
				<p class="muted">
					You can save a rough draft at any point. Pay only when the listing looks clear enough for a
					diaspora renter or returning family to understand quickly.
				</p>
			</div>

			<div class="checklist">
				{#each readinessChecks as check}
					<div class:complete={check.complete} class="check-row">
						<span>{check.complete ? 'Done' : 'Pending'}</span>
						<strong>{check.label}</strong>
					</div>
				{/each}
			</div>
		</div>

		<section class="form-section">
			<div class="section-header">
				<div>
					<p class="section-kicker">Section 1</p>
					<h2>Core listing details</h2>
					<p class="muted">Start with the basics a renter or relocating family needs to scan first.</p>
				</div>
			</div>

			<div class="form-grid">
				<label><span>Listing title</span><input name="title" bind:value={title} required /></label>
				<label><span>Custom slug</span><input name="slug" bind:value={slug} placeholder="optional-custom-slug" /></label>
				<label class="full"><span>Summary</span><textarea name="summary" bind:value={summary} rows="2" required></textarea></label>
				<label class="full"><span>Description</span><textarea name="description" bind:value={description} rows="6" required></textarea></label>
				<label>
					<span>Listing type</span>
					<select name="listingType" bind:value={listingType}>
						<option value="APARTMENT">Apartment</option>
						<option value="HOUSE">House</option>
						<option value="DEVELOPMENT">Development</option>
					</select>
				</label>
				<label>
					<span>Stay type</span>
					<select name="stayType" bind:value={stayType}>
						<option value="SHORT_STAY">Short stay</option>
						<option value="LONG_STAY">Long stay</option>
						<option value="FLEXIBLE">Flexible</option>
					</select>
				</label>
				<label><span>Location</span><input name="location" bind:value={location} placeholder="Accra" required /></label>
				<label><span>Neighborhood</span><input name="neighborhood" bind:value={neighborhood} placeholder="East Legon" /></label>
				<label><span>Bedrooms</span><input name="bedrooms" bind:value={bedrooms} inputmode="numeric" placeholder="2" /></label>
				<label><span>Bathrooms</span><input name="bathrooms" bind:value={bathrooms} inputmode="numeric" placeholder="2" /></label>
				<label class="checkbox"><input type="checkbox" name="furnished" bind:checked={furnished} /><span>Furnished</span></label>
				<label class="checkbox"><input type="checkbox" name="familyFriendly" bind:checked={familyFriendly} /><span>Family-friendly</span></label>
			</div>
		</section>

		<section class="form-section">
			<div class="section-header">
				<div>
					<p class="section-kicker">Section 2</p>
					<h2>Price, contact, and context</h2>
					<p class="muted">Keep this concrete. Clear basics outperform vague sales language.</p>
				</div>
			</div>

			<div class="form-grid">
				<label><span>Price</span><input name="priceAmount" bind:value={priceAmount} inputmode="numeric" placeholder="1500" /></label>
				<label><span>Currency</span><input name="currency" bind:value={currency} /></label>
				<label><span>Price period</span><input name="pricePeriod" bind:value={pricePeriod} placeholder="month" /></label>
				<label><span>Availability</span><input name="availabilityText" bind:value={availabilityText} placeholder="Available now / from June" /></label>
				<label><span>Owner / agent name</span><input name="ownerName" bind:value={ownerName} /></label>
				<label><span>Phone / WhatsApp</span><input name="ownerPhone" bind:value={ownerPhone} /></label>
				<label><span>Provider name</span><input name="providerName" bind:value={providerName} placeholder="Property name, owner, or agency" /></label>
				<label><span>Contact method</span><input name="contactMethod" bind:value={contactMethod} /></label>
				<label><span>Inquiry destination</span><input name="inquiryDestination" bind:value={inquiryDestination} /></label>
				<label class="full"><span>Diaspora notes</span><textarea name="diasporaFriendlyNotes" bind:value={diasporaFriendlyNotes} rows="4" placeholder="What a diaspora renter or returning family should understand early"></textarea></label>
			</div>
		</section>

		<section class="form-section">
			<div class="section-header">
				<div>
					<p class="section-kicker">Section 3</p>
					<h2>Photos</h2>
					<p class="muted">Upload clear, well-lit images. The first image becomes the lead image.</p>
				</div>
			</div>

			<div class="media-card">
				<div class="media-header">
					<div>
						<span class="media-title">Images</span>
						<p>Upload up to 10 property photos. These go to your Supabase Storage bucket.</p>
					</div>
					<label class="upload-button">
						<input type="file" accept="image/*" multiple onchange={handleImageUpload} />
						{uploadLoading ? 'Uploading...' : 'Upload Images'}
					</label>
				</div>

				{#if uploadError}
					<p class="status error">{uploadError}</p>
				{/if}

				{#if images.length === 0}
					<p class="muted">No images uploaded yet.</p>
				{:else}
					<div class="image-stack">
						{#each images as image, index}
							<div class="image-row">
								<img src={image.url} alt={image.alt || title || 'Listing image'} />
								<div class="image-copy">
									<strong>Image {index + 1}</strong>
									<p>{image.storagePath || image.url}</p>
								</div>
								<div class="image-actions">
									<button type="button" onclick={() => moveImage(index, -1)} disabled={index === 0}>Up</button>
									<button type="button" onclick={() => moveImage(index, 1)} disabled={index === images.length - 1}>Down</button>
									<button type="button" onclick={() => removeImage(index)}>Remove</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>

		<div class="footer-actions">
			<div class="action-copy">
				<p class="section-kicker">Next Step</p>
				<p class="muted">
					{#if submitDisabled}
						This listing has already moved past the payment step.
					{:else if isReadyToSubmit}
						This draft looks ready for payment and review.
					{:else}
						You can still save now and finish the missing pieces later.
					{/if}
				</p>
			</div>

			<Button type="submit" formaction="?/save" variant="outline" size="lg">Save Draft</Button>
			<Button
				type="submit"
				formaction="?/payAndSubmit"
				variant="brand"
				size="lg"
				disabled={submitDisabled}
			>
				{submitDisabled ? 'Already Submitted' : `Pay $${ownerListingFeeUsd} And Submit`}
			</Button>
		</div>
	</form>

	<div class="preview-column">
		<div class="preview-summary">
			<p class="section-kicker">Preview Checklist</p>
			<h2>Quick mobile check before you submit</h2>
			<ul>
				<li>Does the title clearly describe the property?</li>
				<li>Would the first photo make someone tap into the listing?</li>
				<li>Can a renter understand the price, area, and setup in seconds?</li>
			</ul>
		</div>

		<HousingOwnerListingPreview listing={previewListing} />
	</div>
</div>

<style>
	.editor-grid {
		display: grid;
		gap: 1rem;
	}

	.editor-card,
	.preview-column {
		padding: 1.35rem;
		border-radius: 2rem;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 20px 48px rgba(17, 17, 17, 0.1);
	}

	.topbar,
	.header,
	.form-grid,
	.footer-actions,
	.image-stack,
	.submission-card,
	.checklist,
	.preview-summary {
		display: grid;
		gap: 1rem;
	}

	.topbar {
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
	}

	.back-link {
		font-weight: 700;
		color: #026b1d;
		text-decoration: none;
	}

	.status-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.1rem;
		padding: 0 0.9rem;
		border-radius: 999px;
		background: #faf5e5;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.eyebrow,
	.section-kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.eyebrow {
		color: rgba(3, 140, 37, 0.82);
	}

	.section-kicker {
		color: rgba(17, 17, 17, 0.56);
	}

	h1,
	h2,
	p,
	strong,
	ul {
		margin: 0;
	}

	h1,
	h2 {
		letter-spacing: -0.05em;
	}

	h1 {
		margin-top: 0.7rem;
		line-height: 0.95;
		font-size: clamp(2rem, 4vw, 3.2rem);
	}

	h2 {
		line-height: 1;
		font-size: clamp(1.4rem, 2vw, 2rem);
	}

	.copy,
	.muted,
	.media-header p,
	.image-copy p,
	.preview-summary ul {
		color: rgba(17, 17, 17, 0.72);
		line-height: 1.7;
	}

	.submission-card,
	.form-section,
	.preview-summary {
		margin-top: 1rem;
		padding: 1.1rem;
		border-radius: 1.6rem;
		background: #faf5e5;
	}

	.section-header {
		margin-bottom: 1rem;
	}

	label {
		display: grid;
		gap: 0.42rem;
	}

	label span,
	.media-title {
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.58);
	}

	.check-row {
		display: grid;
		gap: 0.2rem;
		padding: 0.85rem 1rem;
		border-radius: 1.1rem;
		background: rgba(255, 255, 255, 0.7);
	}

	.check-row span {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #b10323;
	}

	.check-row.complete span {
		color: #026b1d;
	}

	input,
	select,
	textarea,
	button {
		width: 100%;
	}

	input,
	select,
	textarea {
		border-radius: 1.2rem;
		border: 1px solid rgba(17, 17, 17, 0.12);
		background: #fff;
		padding: 0.9rem 1rem;
	}

	textarea {
		resize: vertical;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	.checkbox input {
		width: auto;
	}

	.full,
	.media-card {
		grid-column: 1 / -1;
	}

	.media-card {
		padding: 1rem;
		border-radius: 1.6rem;
		background: rgba(255, 255, 255, 0.72);
	}

	.media-header {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
	}

	.upload-button {
		position: relative;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3rem;
		padding: 0 1.1rem;
		border-radius: 999px;
		background: #111111;
		color: white;
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}

	.upload-button input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.image-row {
		display: grid;
		grid-template-columns: 5rem minmax(0, 1fr);
		gap: 0.85rem;
		align-items: start;
		padding: 0.85rem;
		border-radius: 1.2rem;
		background: white;
	}

	.image-row img {
		width: 5rem;
		height: 5rem;
		object-fit: cover;
		border-radius: 1rem;
	}

	.image-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		grid-column: 1 / -1;
	}

	.image-actions button {
		width: auto;
		min-height: 2.4rem;
		padding: 0 0.9rem;
		border-radius: 999px;
		border: 1px solid rgba(17, 17, 17, 0.12);
		background: #faf5e5;
		font-size: 0.78rem;
		font-weight: 700;
	}

	.footer-actions {
		margin-top: 1.2rem;
	}

	.action-copy {
		grid-column: 1 / -1;
	}

	.preview-summary ul {
		padding-left: 1.1rem;
		display: grid;
		gap: 0.45rem;
	}

	.preview-column {
		display: grid;
		align-content: start;
		gap: 1rem;
	}

	.status {
		margin: 0.75rem 0 0;
		font-size: 0.95rem;
	}

	.status.success {
		color: #026b1d;
	}

	.status.error {
		color: #b10323;
	}

	@media (min-width: 960px) {
		.editor-grid {
			grid-template-columns: minmax(0, 1.1fr) minmax(22rem, 0.75fr);
			align-items: start;
		}

		.preview-column {
			position: sticky;
			top: 6.5rem;
		}

		.form-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.footer-actions {
			grid-template-columns: minmax(0, 1fr) repeat(2, minmax(0, 14rem));
			align-items: end;
		}

		.image-row {
			grid-template-columns: 5rem minmax(0, 1fr) auto;
		}

		.image-actions {
			grid-column: auto;
			flex-direction: column;
		}
	}
</style>
