<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/layout/LogoutButton.svelte');

	const logout = async () => {
		await fetch('/auth/logout', { method: 'POST' });
		location.href = '/login';
	};
</script>

<button
	class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
	onclick={logout}
>
	Logout
</button>
