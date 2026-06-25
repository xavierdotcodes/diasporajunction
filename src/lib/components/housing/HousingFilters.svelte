<script>
	import { captureAnalyticsEvent } from '$lib/client/analytics';

	let { filters } = $props();

	function handleSubmit(event) {
		const formData = new FormData(event.currentTarget);

		captureAnalyticsEvent('housing_filters_applied', {
			has_location: Boolean(String(formData.get('location') || '').trim()),
			listing_type: formData.get('listingType') || undefined,
			stay_type: formData.get('stayType') || undefined,
			has_min_price: Boolean(String(formData.get('minPrice') || '').trim()),
			has_max_price: Boolean(String(formData.get('maxPrice') || '').trim()),
			furnished: formData.get('furnished') === '1',
			family_friendly: formData.get('familyFriendly') === '1'
		});
	}
</script>

<form
	class="filters"
	method="GET"
	data-analytics-event="housing_filters_submitted"
	data-analytics-id="housing_filters"
	onsubmit={handleSubmit}
>
	<label>
		<span>Location</span>
		<input name="location" value={filters.location} placeholder="Accra, East Legon, Cantonments..." />
	</label>

	<label>
		<span>Type</span>
		<select name="listingType" value={filters.listingType}>
			<option value="">All types</option>
			<option value="APARTMENT">Apartment</option>
			<option value="HOUSE">House</option>
			<option value="DEVELOPMENT">Development</option>
		</select>
	</label>

	<label>
		<span>Stay</span>
		<select name="stayType" value={filters.stayType}>
			<option value="">Any stay</option>
			<option value="SHORT_STAY">Short stay</option>
			<option value="LONG_STAY">Long stay</option>
			<option value="FLEXIBLE">Flexible</option>
		</select>
	</label>

	<label>
		<span>Min price</span>
		<input name="minPrice" inputmode="numeric" value={filters.minPrice ?? ''} placeholder="500" />
	</label>

	<label>
		<span>Max price</span>
		<input name="maxPrice" inputmode="numeric" value={filters.maxPrice ?? ''} placeholder="3000" />
	</label>

	<label class="checkbox">
		<input type="checkbox" name="furnished" value="1" checked={filters.furnished} />
		<span>Furnished</span>
	</label>

	<label class="checkbox">
		<input type="checkbox" name="familyFriendly" value="1" checked={filters.familyFriendly} />
		<span>Family-friendly</span>
	</label>

	<div class="actions">
		<button type="submit">Apply</button>
		<a
			href="/housing/listings"
			data-analytics-event="housing_filters_reset"
			data-analytics-area="housing_filters"
		>
			Reset
		</a>
	</div>
</form>

<style>
	.filters {
		display: grid;
		gap: 0.9rem;
		padding: 1.2rem;
		border-radius: 1.8rem;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 16px 40px rgba(17, 17, 17, 0.08);
	}

	label {
		display: grid;
		gap: 0.4rem;
	}

	label span {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.6);
	}

	input,
	select,
	button,
	a {
		min-height: 3rem;
		border-radius: 999px;
	}

	input,
	select {
		border: 1px solid rgba(17, 17, 17, 0.12);
		background: #fff;
		padding: 0 1rem;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	.checkbox input {
		min-height: auto;
	}

	.checkbox span {
		letter-spacing: 0.04em;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	button,
	a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0 1.1rem;
		border: 0;
		font-size: 0.84rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		text-decoration: none;
	}

	button {
		background: #038c25;
		color: white;
	}

	a {
		background: #faf5e5;
		color: #111111;
	}
</style>
