<script>
	import { onMount } from 'svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/layout/SocialLinks.svelte');

	import {
		faInstagram,
		faTiktok,
		faYoutube,
		faPinterest,
		faXTwitter,
		faFacebook,
		faLinkedin
	} from '@fortawesome/free-brands-svg-icons';

	let Fa = $state();

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
		{ icon: faTiktok, url: 'https://tiktok.com/@diasporajunxion', label: 'TikTok' },
		{ icon: faPinterest, url: 'https://www.pinterest.com/diasporajunxion/', label: 'Pinterest' },
		{
			icon: faLinkedin,
			url: 'https://www.linkedin.com/company/diasporajunxion',
			label: 'LinkedIn'
		},
		{ icon: faXTwitter, url: 'https://x.com/diasporajunxion', label: 'X' }
	];
</script>

{#if Fa}
	<div class="flex flex-wrap items-center justify-center gap-2 md:justify-start">
		{#each socials as { icon, url, label }}
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={label}
				class={cn(
					buttonVariants({ variant: 'ghost', size: 'icon' }),
					'h-10 w-10 rounded-full border border-white/14 bg-white/6 text-white/78 hover:border-[#F2B705]/40 hover:bg-[#F2B705] hover:text-[#111111]'
				)}
			>
				<Fa {icon} class="text-base" />
			</a>
		{/each}
	</div>
{/if}
