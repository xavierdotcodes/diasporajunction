function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function redirectAfterSupabaseAuth(next = '/housing/owners', { timeoutMs = 4000 } = {}) {
	const deadline = Date.now() + timeoutMs;

	while (Date.now() < deadline) {
		try {
			const response = await fetch('/auth/session', {
				method: 'GET',
				cache: 'no-store',
				headers: {
					'cache-control': 'no-store'
				}
			});

			if (response.ok) {
				const payload = await response.json();
				if (payload?.authenticated) {
					window.location.assign(next);
					return;
				}
			}
		} catch {
			// Fall through to the next retry.
		}

		await sleep(150);
	}

	window.location.assign(next);
}
