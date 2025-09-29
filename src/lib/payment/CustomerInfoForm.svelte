<script>
	export let customer;
</script>

<div class="space-y-4">
	<input bind:value={customer.name} placeholder="Full Name" class="input" />
	<input bind:value={customer.email} placeholder="Email" class="input" />
	<input bind:value={customer.street} placeholder="Street Address" class="input" />
	<input bind:value={customer.apt} placeholder="Apt / Suite" class="input" />
	<div class="grid grid-cols-2 gap-2">
		<input bind:value={customer.city} placeholder="City" class="input" />
		<input bind:value={customer.state} placeholder="State" class="input" />
	</div>
	<div class="grid grid-cols-2 gap-2">
		<input bind:value={customer.country} placeholder="Country" class="input" />
		<input bind:value={customer.zip} placeholder="ZIP Code" class="input" />
	</div>
</div>

<style>
	.input {
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.95rem;
		transition:
			border 0.2s,
			box-shadow 0.2s;
	}
	.input:focus {
		outline: none;
		border-color: #6366f1;
		box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
	}
</style>
