<script>
	export let form;
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
	<div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
		<div class="flex justify-center mb-6">
			<img src="/logo.png" alt="Logo" class="h-12" />
		</div>

		<h1 class="text-2xl font-bold mb-4 text-center">Admin Login</h1>

		{#if form?.error}
			<p class="text-red-400 text-center mb-4">{form.error}</p>
		{/if}

		<form method="POST" class="space-y-4">
			<input
				type="email"
				name="email"
				placeholder="Email"
				required
				class="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-400"
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				required
				class="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-400"
			/>
			<button
				type="submit"
				class="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded"
			>
				Log In
			</button>
		</form>
	</div>
</div>
