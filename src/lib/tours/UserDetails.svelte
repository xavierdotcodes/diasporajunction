<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let formData;

	let errors = {
		name: '',
		email: '',
		phone: ''
	};

	function validate() {
		errors = { name: '', email: '', phone: '' };

		if (!formData.name.trim()) {
			errors.name = 'Full name is required.';
		}

		if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = 'Please enter a valid email address.';
		}

		if (!formData.phone.trim() || !/^\+?\d{7,15}$/.test(formData.phone)) {
			errors.phone = 'Please enter a valid phone number (with country code if possible).';
		}

		dispatch('validate', { valid: Object.values(errors).every((e) => !e) });
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<h2 class="text-2xl font-bold mb-4 text-gray-900">Your Details</h2>

	<!-- Full Name -->
	<div>
		<input
			type="text"
			placeholder="Full Name"
			bind:value={formData.name}
			on:blur={validate}
			class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
		/>
		{#if errors.name}
			<p class="text-red-500 text-sm mt-1">{errors.name}</p>
		{/if}
	</div>

	<!-- Email -->
	<div>
		<input
			type="email"
			placeholder="Email"
			bind:value={formData.email}
			on:blur={validate}
			class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
		/>
		{#if errors.email}
			<p class="text-red-500 text-sm mt-1">{errors.email}</p>
		{/if}
	</div>

	<!-- Phone -->
	<div>
		<input
			type="tel"
			placeholder="Phone (include country code)"
			bind:value={formData.phone}
			on:blur={validate}
			class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
		/>
		{#if errors.phone}
			<p class="text-red-500 text-sm mt-1">{errors.phone}</p>
		{/if}
	</div>

	<!-- City & Country -->
	<div class="grid sm:grid-cols-2 gap-4">
		<input
			type="text"
			placeholder="City"
			bind:value={formData.city}
			class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
		/>
		<input
			type="text"
			placeholder="Country"
			bind:value={formData.country}
			class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
		/>
	</div>

	<!-- Travel Details -->
	<textarea
		placeholder="Tell us about your interests, dietary needs, or travel goals..."
		bind:value={formData.notes}
		class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
		rows="4"
	></textarea>

	<!-- Calendly Invite -->
	<div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
		<h3 class="font-semibold text-gray-900 text-lg mb-2">Want to discuss your trip?</h3>
		<p class="text-gray-600 text-sm mb-3">
			Schedule a quick Zoom chat to prepare for your Ghana immersion experience.
		</p>

		<!-- Replace the href with your actual Calendly link -->
		<a
			href="https://calendly.com/your-calendly-link/ghana-tour"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full transition"
		>
			Schedule a Call
		</a>
	</div>
</div>

<style>
	input:hover,
	textarea:hover,
	input:focus,
	textarea:focus {
		border-color: #f2b705;
	}
</style>
