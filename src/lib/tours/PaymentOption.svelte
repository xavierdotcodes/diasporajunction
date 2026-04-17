<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/tours/PaymentOption.svelte');

	let { formData = $bindable() } = $props();
</script>

<h2 class="text-xl font-bold mb-4">Payment Option</h2>
<div class="space-y-2">
	<label class="flex items-center gap-2">
		<input type="radio" bind:group={formData.paymentOption} value="Full" />
		Pay in Full
	</label>
	<label class="flex items-center gap-2">
		<input type="radio" bind:group={formData.paymentOption} value="Installments" />
		Installments
	</label>
</div>
