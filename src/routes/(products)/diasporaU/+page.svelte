<script>
	import Hero from '$lib/ui/Hero.svelte';
	import Title from '$lib/ui/Title.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/routes/(products)/diasporaU/+page.svelte');

	let title = 'Diaspora United';
</script>

<Hero
	subtitle="The first Diaspora-owned football club in Ghana.
Where culture meets competition."
	description=""
	desktopVideoSrc="/videos/desktop_diasporau-hero.mp4"
	desktopPosterSrc="/videos/covers/desktop_diasporau-hero-cover.jpg"
	mobileVideoSrc="/videos/mobile_diasporau-hero.mp4"
	mobilePosterSrc="/videos/covers/mobile_diasporau-hero-cover.jpg"
>
	{#snippet logo()}
		<Logo  src="/images/logos/diasporau.png" width="200" />
	{/snippet}
	{#snippet title()}
		<Title  {title} highlight="United" />
	{/snippet}
</Hero>
