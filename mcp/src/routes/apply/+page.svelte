<script>
	import { directoryCategories, categoryDisplayName } from '$lib/directory/constants.js';
	let { form } = $props();
</script>

<svelte:head>
	<title>Apply for a Verified Listing | DiasporaJunxion</title>
	<meta
		name="description"
		content="Apply for a verified, AI-searchable DiasporaJunxion profile for your Ghana-based service."
	/>
</svelte:head>

<main class="shell page">
	<header class="intro">
		<p class="eyebrow">Provider application</p>
		<h1>Apply for a founding verified listing.</h1>
		<p class="lede">
			This application is for providers and businesses that want a public DiasporaJunxion profile for diaspora-facing Ghana services.
		</p>
	</header>

	<section class="panel offer">
		<h2>What this application covers</h2>
		<div class="grid two">
			<ul>
				<li>Approved listings become public profiles in the directory.</li>
				<li>Public profile media such as logo, cover image, gallery, and portfolio photos can be shown publicly.</li>
				<li>Owners can later manage profile copy, media, profile completeness, and analytics from the dashboard.</li>
			</ul>
			<ul>
				<li>Verification documents are reviewed by admins only and are not shown publicly.</li>
				<li>Payment is for the current application, verification, and listing review flow.</li>
				<li>We do not guarantee instant customers or guaranteed AI/search placement.</li>
			</ul>
		</div>
	</section>

	{#if form?.message}<p class="error">{form.message}</p>{/if}

	<form method="POST" class="panel form">
		<h2>Business details</h2>
		<input name="businessName" placeholder="Business name" required />
		<input name="contactName" placeholder="Contact name" required />
		<div class="grid two">
			<input name="email" type="email" placeholder="Email" required />
			<input name="phone" placeholder="Phone" required />
		</div>
		<div class="grid two">
			<input name="whatsapp" placeholder="WhatsApp, optional" />
			<input name="website" placeholder="Website, optional" />
		</div>

		<h2>Public profile copy</h2>
		<select name="category" required>
			<option value="">Select category</option>
			{#each directoryCategories as category}
				<option value={category}>{categoryDisplayName(category)}</option>
			{/each}
		</select>
		<input name="customCategory" placeholder="Custom category if Other" />
		<textarea name="description" placeholder="Full public description of your service" required></textarea>
		<input name="shortDescription" placeholder="Short public description" />
		<input name="servicesOffered" placeholder="Services offered, comma separated" />
		<input name="keywords" placeholder="Keywords customers may search for, comma separated" />

		<h2>Location and audience</h2>
		<div class="grid two">
			<input name="city" placeholder="City" required />
			<input name="region" placeholder="Region" required />
		</div>
		<div class="grid two">
			<input name="country" placeholder="Country" value="Ghana" required />
			<input name="serviceArea" placeholder="Service area" required />
		</div>
		<select name="targetAudience" required>
			<option value="">Target audience</option>
			<option value="LOCAL">Local customers</option>
			<option value="DIASPORA">Diaspora customers</option>
			<option value="BOTH">Local and diaspora customers</option>
		</select>
		<div class="grid two">
			<input name="languages" placeholder="Languages, comma separated" />
			<input name="priceRange" placeholder="Price range, optional" />
		</div>
		<div class="checks">
			<label><input type="checkbox" name="remoteAvailable" /> Remote available</label>
			<label><input type="checkbox" name="inPersonAvailable" checked /> In-person available</label>
			<label><input type="checkbox" name="whatsappAvailable" checked /> WhatsApp available</label>
		</div>
		<input name="referralCode" placeholder="Referral code, optional" />
		<button class="button" type="submit">Submit application</button>
	</form>
</main>

<style>
	.page { padding: 3rem 0; display:grid; gap:1.25rem; }
	.intro { display:grid; gap:.75rem; max-width:820px; }
	.eyebrow { text-transform:uppercase; letter-spacing:.08em; font-weight:900; color:#4b5a32; margin:0; }
	h1 { font-size:clamp(2rem, 5vw, 4rem); line-height:1; margin:0; }
	h2 { margin:.25rem 0; }
	.lede { font-size:1.15rem; max-width:760px; }
	.form { display:grid; gap:.8rem; max-width:820px; width:100%; }
	.offer ul { margin:.25rem 0 0; padding-left:1.2rem; }
	input, textarea, select { width:100%; padding:.75rem; border:1px solid #d8d3c8; border-radius:.5rem; font:inherit; }
	textarea { min-height:8rem; }
	.checks { display:flex; flex-wrap:wrap; gap:.75rem; }
	.checks label { display:flex; align-items:center; gap:.4rem; font-weight:700; }
	.error { color:#a33020; }
</style>
