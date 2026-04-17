<script>
	import { createEventDispatcher } from 'svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/payment/CustomerInfoForm.svelte');
	let { customer = $bindable() } = $props();

	const dispatch = createEventDispatcher();

	// Simple email validation
	let validEmail = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email));

	function handleNext() {
		if (
			customer.name.trim() &&
			validEmail &&
			customer.street.trim() &&
			customer.city.trim() &&
			customer.state.trim() &&
			customer.country.trim().length === 2 &&
			customer.zip.trim()
		) {
			dispatch('next', { customer });
		}
	}
</script>

<div class="form space-y-5">
	<div class="field">
		<label for="customer-name">Full Name</label>
		<input id="customer-name" bind:value={customer.name} placeholder="John Doe" />
	</div>

	<div class="field">
		<label for="customer-email">Email</label>
		<input id="customer-email" bind:value={customer.email} type="email" placeholder="you@example.com" />
		{#if customer.email && !validEmail}
			<p class="error">Please enter a valid email.</p>
		{/if}
	</div>

	<div class="field">
		<label for="customer-street">Street Address</label>
		<input id="customer-street" bind:value={customer.street} placeholder="123 Main St" />
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="field">
			<label for="customer-city">City</label>
			<input id="customer-city" bind:value={customer.city} placeholder="Accra" />
		</div>
		<div class="field">
			<label for="customer-state">State</label>
			<input id="customer-state" bind:value={customer.state} placeholder="Greater Accra" />
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="field">
			<label for="customer-country">Country</label>
			<input id="customer-country" bind:value={customer.country} placeholder="GH" maxlength="2" />
		</div>
		<div class="field">
			<label for="customer-zip">ZIP</label>
			<input id="customer-zip" bind:value={customer.zip} placeholder="00233" />
		</div>
	</div>
</div>

<style>
	.form {
		font-family: system-ui, sans-serif;
		color: #111827;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}

	input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		border: 1.5px solid #d1d5db;
		background: #f9fafb;
		font-size: 0.95rem;
		transition: all 0.15s ease;
	}

	input:focus {
		outline: none;
		border-color: #4f46e5;
		background: white;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
	}

	.error {
		color: #dc2626;
		font-size: 0.8rem;
	}
</style>
