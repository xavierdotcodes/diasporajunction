<script>
	import { onMount } from 'svelte';
	import {
		faInstagram,
		faTiktok,
		faYoutube,
		faPinterest,
		faXTwitter,
		faFacebook,
		faLinkedin,
		faTwitch
	} from '@fortawesome/free-brands-svg-icons';

	let Fa;

	onMount(async () => {
		const module = await import('svelte-fa');
		Fa = module.Fa;
	});

	const socials = [
		{ icon: faInstagram, url: 'https://instagram.com/yourpage', label: 'Instagram' },
		{ icon: faTiktok, url: 'https://tiktok.com/@yourpage', label: 'TikTok' },
		{ icon: faYoutube, url: 'https://youtube.com/yourpage', label: 'YouTube' },
		{ icon: faPinterest, url: 'https://pinterest.com/yourpage', label: 'Pinterest' },
		{ icon: faXTwitter, url: 'https://x.com/yourpage', label: 'X (Twitter)' },
		{ icon: faFacebook, url: 'https://facebook.com/yourpage', label: 'Facebook' },
		{ icon: faLinkedin, url: 'https://linkedin.com/in/yourpage', label: 'LinkedIn' },
		{ icon: faTwitch, url: 'https://twitch.tv/yourpage', label: 'Twitch' }
	];
</script>

<footer class="bg-[#F2B705] border-t-4 border-black py-6 px-4 text-center text-black">
	<p class="text-sm">© 2025 DiasporaJunxion. All rights reserved.</p>
	{#if Fa}
		<div class="socials">
			{#each socials as { icon, url, label }}
				<a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
					<Fa {icon} />
				</a>
			{/each}
		</div>
	{/if}
</footer>

<style>
	.socials {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 0.5rem;
		flex-wrap: wrap;
	}

	.socials a {
		width: 40px;
		height: 40px;
		font-size: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffcc00;
		background: transparent;
		border-radius: 50%;
		transition:
			transform 0.2s,
			color 0.2s;
	}

	.socials a:hover {
		transform: scale(1.2);
		color: #fff;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.socials a {
			width: 36px;
			height: 36px;
			font-size: 1.3rem;
		}

		.socials {
			gap: 0.8rem;
		}
	}

	@media (max-width: 480px) {
		.socials a {
			width: 32px;
			height: 32px;
			font-size: 1.1rem;
		}

		.socials {
			gap: 0.6rem;
		}
	}
</style>
