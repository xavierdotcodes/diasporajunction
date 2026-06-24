<script>
	import { directoryCategories } from '$lib/directory/constants.js';
	let { form } = $props();
</script>

<main class="shell page">
	<h1>Apply to be listed</h1>
	<p class="muted">Submit your business or service for directory review. Payment is handled on the next step.</p>
	{#if form?.message}<p class="error">{form.message}</p>{/if}
	<form method="POST" class="panel form">
		<input name="businessName" placeholder="Business name" required />
		<input name="contactName" placeholder="Contact name" required />
		<input name="email" type="email" placeholder="Email" required />
		<input name="phone" placeholder="Phone" required />
		<input name="whatsapp" placeholder="WhatsApp" />
		<input name="website" placeholder="Website" />
		<select name="category" required>
			{#each directoryCategories as category}
				<option value={category}>{category}</option>
			{/each}
		</select>
		<input name="customCategory" placeholder="Custom category if OTHER" />
		<textarea name="description" placeholder="Full description" required></textarea>
		<input name="shortDescription" placeholder="Short description" />
		<input name="servicesOffered" placeholder="Services offered, comma separated" />
		<input name="keywords" placeholder="Keywords, comma separated" />
		<input name="city" placeholder="City" required />
		<input name="region" placeholder="Region" required />
		<input name="country" placeholder="Country" value="Ghana" required />
		<input name="serviceArea" placeholder="Service area" required />
		<select name="targetAudience">
			<option value="BOTH">Local and diaspora</option>
			<option value="DIASPORA">Diaspora</option>
			<option value="LOCAL">Local</option>
		</select>
		<input name="languages" placeholder="Languages, comma separated" />
		<label><input type="checkbox" name="remoteAvailable" /> Remote available</label>
		<label><input type="checkbox" name="inPersonAvailable" checked /> In-person available</label>
		<label><input type="checkbox" name="whatsappAvailable" checked /> WhatsApp available</label>
		<input name="referralCode" placeholder="Referral code, optional" />
		<button class="button" type="submit">Submit and continue to payment</button>
	</form>
</main>

<style>
	.page { padding: 3rem 0; }
	.form { display: grid; gap: .8rem; max-width: 720px; }
	input, select, textarea { width: 100%; padding: .75rem; border: 1px solid #d8d3c8; border-radius: .5rem; }
	textarea { min-height: 8rem; }
	.error { color: #a33020; }
</style>
