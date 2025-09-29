<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Fa from 'svelte-fa';
	import {
		faInstagram,
		faTiktok,
		faYoutube,
		faPinterest,
		faXTwitter,
		faFacebook,
		faLinkedin,
		faTwitch,
		faGithub
	} from '@fortawesome/free-brands-svg-icons';

	export let name;
	export let role;
	export let image;
	export let bio;
	export let socials = {};
	export let index = 0; // pass index so we can alternate direction

	const icons = {
		instagram: faInstagram,
		tiktok: faTiktok,
		youtube: faYoutube,
		pinterest: faPinterest,
		twitter: faXTwitter,
		facebook: faFacebook,
		linkedin: faLinkedin,
		twitch: faTwitch,
		github: faGithub
	};

	let section;
	let img;
	let text;

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Animate image
		gsap.from(img, {
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				once: true
			},
			x: index % 2 === 0 ? -100 : 100,
			opacity: 0,
			duration: 1,
			ease: 'power3.out'
		});

		// Animate text
		gsap.from(text, {
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				once: true
			},
			x: index % 2 === 0 ? 100 : -100,
			opacity: 0,
			duration: 1,
			delay: 0.2,
			ease: 'power3.out'
		});
	});
</script>

<div
	bind:this={section}
	class="team-section flex flex-col lg:flex-row items-center gap-10 lg:gap-16 {index % 2 === 1
		? 'lg:flex-row-reverse'
		: ''}"
>
	<div bind:this={img} class="team-image flex-shrink-0 w-full lg:w-1/2 flex justify-center">
		<img
			src={image}
			alt={name}
			class="w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-full border-8 border-[#F2B705] shadow-xl"
		/>
	</div>

	<div bind:this={text} class="team-text w-full lg:w-1/2 text-center lg:text-left">
		<h2 class="text-2xl sm:text-3xl font-semibold text-[#038C25] mb-2">{name}</h2>
		<p class="text-lg font-medium text-[#F29F05] mb-4">{role}</p>
		<p class="text-base text-gray-600 leading-relaxed mb-4">{bio}</p>

		{#if Object.keys(socials).length > 0}
			<div class="socials flex justify-center lg:justify-start gap-4 flex-wrap">
				{#each Object.entries(socials) as [platform, link]}
					{#if icons[platform]}
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={platform}
							class="w-10 h-10 flex items-center justify-center text-xl text-[#ffcc00] rounded-full transition-transform duration-200 hover:scale-125 hover:text-white"
						>
							<Fa icon={icons[platform]} />
						</a>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	@media (max-width: 768px) {
		.team-section {
			gap: 2rem;
		}
		.socials a {
			width: 36px;
			height: 36px;
			font-size: 1.3rem;
		}
	}

	@media (max-width: 480px) {
		.team-section {
			gap: 1.5rem;
		}
		.socials a {
			width: 32px;
			height: 32px;
			font-size: 1.1rem;
		}
	}
</style>
