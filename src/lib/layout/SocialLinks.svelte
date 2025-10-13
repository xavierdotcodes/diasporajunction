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
		{
			icon: faFacebook,
			url: 'https://web.facebook.com/profile.php?id=61581096637453',
			label: 'Facebook'
		},
		{ icon: faInstagram, url: 'https://instagram.com/diasporajunxion', label: 'Instagram' },
		{ icon: faYoutube, url: 'https://www.youtube.com/@diasporajunxion', label: 'YouTube' },
		{ icon: faTiktok, url: 'https://tiktok.com/@yourpage', label: 'TikTok' },
		{ icon: faPinterest, url: 'https://www.pinterest.com/diasporajunxion/', label: 'Pinterest' },
		{
			icon: faLinkedin,
			url: 'https://www.linkedin.com/company/diasporajunxion',
			label: 'LinkedIn'
		},
		{ icon: faXTwitter, url: 'https://x.com/diasporajunxion', label: 'X (Twitter)' }
		//{ icon: faTwitch, url: 'https://twitch.tv/yourpage', label: 'Twitch' }
	];
</script>

{#if Fa}
	<div class="socials">
		{#each socials as { icon, url, label }}
			<a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
				<Fa {icon} />
			</a>
		{/each}
	</div>
{/if}

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
