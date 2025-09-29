<script>
	import { enhance } from '$app/forms';
	let submitting = false;
	let errorMessage = '';
	let formEl;

	// Apply SvelteKit form enhancement
	$: if (formEl) {
		enhance(formEl, (form, submit) => {
			submitting = true; // show spinner
			return async (res) => {
				submitting = false;
				console.log('res', res);

				if (res.result.type === 'failure' && res.data?.error) {
					errorMessage = res.data.error;
				} else {
					errorMessage = '';
				}

				// redirect from server
				if (res.result.type === 'redirect' && res.result.location) {
					window.location.href = res.result.location;
				}
			};
		});
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-900">
	<div class="bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md">
		<div class="flex justify-center mb-6">
			<img src="/logo.png" alt="Logo" class="h-14" />
		</div>

		<h1 class="text-3xl font-bold mb-6 text-center text-yellow-400">Admin Login</h1>

		{#if errorMessage}
			<p class="text-red-400 text-center mb-4">{errorMessage}</p>
		{/if}

		<form bind:this={formEl} method="POST" class="space-y-5">
			<input
				type="email"
				name="email"
				placeholder="Email"
				required
				class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				required
				class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
			/>

			<button
				type="submit"
				disabled={submitting}
				class="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-lg disabled:opacity-70 transition-all duration-150"
			>
				{#if submitting}
					<svg
						class="animate-spin h-5 w-5 mr-2 text-black"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
					</svg>
					Logging in...
				{:else}
					Log In
				{/if}
			</button>
		</form>
	</div>
</div>

<style>
	.animate-spin {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
