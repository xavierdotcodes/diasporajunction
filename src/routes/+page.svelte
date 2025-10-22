<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Hero from '$lib/ui/Hero.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import CTASection from '$lib/landing/CTASection.svelte';

	let isMobile = false;

	onMount(() => {
		const checkDevice = () => (isMobile = window.innerWidth <= 768);
		checkDevice();
		window.addEventListener('resize', checkDevice);
		return () => window.removeEventListener('resize', checkDevice);
	});

	const pillars = [
		{
			title: 'Connection',
			description:
				'We’re building real bridges — not just flights — between diaspora travelers and the Ghanaian creative scene.',
			icon: '🔗',
			image: '/images/landing/connection.webp'
		},
		{
			title: 'Innovation',
			description:
				'Africa’s new ideas meet global skillsets. We incubate creative projects that move culture and commerce forward.',
			icon: '💡',
			image: '/images/landing/innovation.webp'
		},
		{
			title: 'Culture',
			description:
				'We amplify the heartbeat of Ghana — nightlife, art, food, and rhythm — and connect it with the world.',
			icon: '🎶',
			image: '/images/landing/culture.webp'
		},
		{
			title: 'Collaboration',
			description:
				'From designers to DJs, coders to curators — DiasporaJunxion is a meeting ground for ideas and partnerships.',
			icon: '🫱🏾‍🫲🏽',
			image: '/images/landing/collaboration.webp'
		},
		{
			title: 'Impact',
			description:
				'Every project supports local makers, artisans, and entrepreneurs. When we grow, communities grow.',
			icon: '🌍',
			image: '/images/landing/impact1.webp'
		}
	];

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Hero title letters animation
		gsap.from('.hero-title span', {
			y: 40,
			opacity: 0,
			stagger: 0.08,
			duration: 1.2,
			ease: 'power4.out'
		});

		// Pillar cards animation
		document.querySelectorAll('.pillar-card').forEach((card, i) => {
			card.style.overflow = 'hidden';
			const text = card.querySelector('.pillar-text');
			const img = card.querySelector('.pillar-image');

			gsap.from(text, {
				x: i % 2 === 0 ? -200 : 200,
				opacity: 0,
				duration: 1.2,
				ease: 'power3.out',
				scrollTrigger: { trigger: card, start: 'top 85%' }
			});

			gsap.from(img, {
				x: i % 2 === 0 ? 200 : -200,
				opacity: 0,
				duration: 1.2,
				delay: 0.2,
				ease: 'power3.out',
				scrollTrigger: { trigger: card, start: 'top 85%' }
			});
		});

		// Approach cards animation
		gsap.utils.toArray('.approach-card').forEach((card, i) => {
			card.style.overflow = 'hidden';
			gsap.from(card, {
				y: 60,
				opacity: 0,
				duration: 1,
				delay: i * 0.15,
				ease: 'power2.out',
				scrollTrigger: { trigger: card, start: 'top 85%' }
			});
		});
	});
</script>

<svelte:head>
	<title>DiasporaJunxion | The Bridge Between Diaspora & African Innovation</title>
	<meta
		name="description"
		content="DiasporaJunxion connects diaspora travelers and African creators through culture, innovation, and impact."
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="landing font-sans bg-black text-white overflow-x-hidden">
	<!-- HERO -->
	<Hero
		title="DiasporaJunxion"
		subtitle="The meeting point of Diaspora Power and African Innovation"
		description={`<span class="font-bold text-white">Diaspora</span> is more than a word — it’s a people.<br/>
			Africans at home and abroad, carrying the continent’s rhythm into every corner of the world.<br/>
			From music to tech, from art to nightlife — we are Africa in motion.<br/><br/>
			<span class="text-[#FFBC03] font-semibold">DiasporaJunxion</span> is the bridge — where we return,
			connect, and build the future together.`}
		desktopVideoSrc="/videos/desktop_landing-hero.mp4"
		desktopPosterSrc="/videos/covers/desktop_landing-hero-cover.jpg"
		mobileVideoSrc="/videos/mobile_landing-hero.mp4"
		mobilePosterSrc="/videos/covers/mobile_landing-hero-cover.jpg"
	>
		<Logo slot="logo" src="/images/logos/diasporajunxion-icon.png" width="200" />

		<a
			slot="cta"
			href="#about"
			class="inline-block bg-[#038C25] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#026b1d] transition"
		>
			Learn More
		</a>
	</Hero>

	<!-- WHAT IS DIASPORAJUNXION -->
	<section id="about" class="bg-white text-black py-20 px-6 md:px-16 text-center">
		<h2 class="text-4xl md:text-5xl font-extrabold mb-6">
			What Is <span class="text-[#D9042B]">DiasporaJunxion</span>?
		</h2>

		<p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
			DiasporaJunxion is a creative business accelerator and incubator built for Ghanaian artists,
			makers, and entrepreneurs — inspired by models like Y Combinator, but grounded in African
			culture and innovation.
		</p>

		<p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
			We help forward-thinking creators refine their craft or venture through structured mentorship,
			access to capital, and global exposure. Our programs connect local talent with diaspora
			expertise and technology to build ventures that move culture forward.
		</p>

		<h3 class="text-2xl font-bold text-gray-900 mb-8 mt-16">
			Beyond Business — Our Creative Ecosystem
		</h3>

		<div class="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto">
			<div class="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition text-center">
				<div class="text-4xl mb-4 flex justify-center">🎨</div>
				<h4 class="font-bold text-xl mb-2 text-[#038C25]">NDGO</h4>
				<p class="text-gray-700 leading-relaxed">
					An art and education program where students learn <span class="font-semibold"
						>art through computers</span
					>
					and <span class="font-semibold">computers through art</span> — shaping the next generation
					of digital creators.
				</p>
			</div>

			<div class="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition text-center">
				<div class="text-4xl mb-4 flex justify-center">⚽️</div>
				<h4 class="font-bold text-xl mb-2 text-[#FFBC03]">DiasporaUnited</h4>
				<p class="text-gray-700 leading-relaxed">
					A football club uniting culture and competition — working to become the first <span
						class="font-semibold">diaspora-owned</span
					> team in the Ghanaian Premier League.
				</p>
			</div>

			<div class="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition text-center">
				<div class="text-4xl mb-4 flex justify-center">🌍</div>
				<h4 class="font-bold text-xl mb-2 text-[#D9042B]">Ghana Experience Tours</h4>
				<p class="text-gray-700 leading-relaxed">
					Curated journeys that blend heritage exploration with Ghana’s vibrant nightlife — helping
					you move with comfort, connection, and familiarity, as if you were a local.
				</p>
			</div>
		</div>

		<p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mt-16">
			Together, these movements form one ecosystem — a place where creativity, culture, and
			community converge to build the future.
		</p>
	</section>

	<!-- PILLARS -->
	<section id="pillars" class="py-20 bg-[#111] text-white text-center">
		<h2 class="text-4xl md:text-5xl font-extrabold mb-12">
			Our <span class="text-[#FFBC03]">Pillars</span>
		</h2>

		<div class="space-y-20 max-w-6xl mx-auto px-6 md:px-8 overflow-hidden">
			{#each pillars as { title, description, image, icon }, i}
				<div
					class="pillar-card flex flex-col md:flex-row items-center gap-10 max-w-full mx-auto overflow-hidden"
					class:md:flex-row-reverse={i % 2 !== 0}
				>
					<div class="pillar-text flex-1 text-center md:text-left">
						<h3 class="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start">
							<span class="mr-2">{icon}</span>{title}
						</h3>
						<p class="text-gray-300 leading-relaxed">{description}</p>
					</div>
					<div class="pillar-image flex-1">
						<img
							src={image}
							alt={title}
							class="rounded-2xl shadow-lg w-full h-[300px] object-cover"
						/>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- OUR APPROACH -->
	<section id="approach" class="bg-white text-black py-20 px-6 md:px-16 text-center">
		<h2 class="text-4xl md:text-5xl font-extrabold mb-10 text-[#D9042B]">Our Approach</h2>
		<p class="text-lg text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
			We help creators go from idea to impact through a simple three-step model —
			<span class="text-[#038C25] font-semibold">Development</span>,
			<span class="text-[#FFBC03] font-semibold">Exposure</span>, and
			<span class="text-[#D9042B] font-semibold">Delivery</span>.
		</p>

		<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			<div
				class="approach-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center"
			>
				<div class="text-4xl mb-4">⚙️</div>
				<h4 class="text-xl font-semibold text-[#038C25] mb-2">Development</h4>
				<p class="text-gray-700 text-sm leading-relaxed">
					We help refine projects and products to meet global standards through mentorship and
					structure.
				</p>
			</div>
			<div
				class="approach-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center"
			>
				<div class="text-4xl mb-4">🌍</div>
				<h4 class="text-xl font-semibold text-[#FFBC03] mb-2">Exposure</h4>
				<p class="text-gray-700 text-sm leading-relaxed">
					We build the outlets and networks for creators to gain visibility on a global stage.
				</p>
			</div>
			<div
				class="approach-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center"
			>
				<div class="text-4xl mb-4">🚀</div>
				<h4 class="text-xl font-semibold text-[#D9042B] mb-2">Delivery</h4>
				<p class="text-gray-700 text-sm leading-relaxed">
					We establish pipelines that connect Ghanaian-made creations directly to international
					markets.
				</p>
			</div>
		</div>

		<p class="mt-12 text-gray-700 max-w-3xl mx-auto text-lg">
			From concept to commerce — <span class="text-[#038C25] font-semibold"
				>we build the bridge</span
			>.
		</p>
	</section>

	<!-- WHY WE EXIST -->
	<section id="story" class="py-20 bg-white px-8 text-center">
		<h3 class="text-3xl font-bold text-black mb-8">Why We Exist</h3>
		<div class="max-w-3xl mx-auto text-gray-700 space-y-4 text-lg">
			<p>
				We built DiasporaJunxion to close the gap between <span class="text-[#038C25] font-semibold"
					>inspiration</span
				>
				and <span class="text-[#D9042B] font-semibold">access</span>. To create a hub where the
				diaspora and Ghana’s creators meet — to collaborate, build, and grow together.
			</p>
			<p>
				Our goal is to make Ghana feel like <em>home</em> for anyone chasing creative expression or purpose.
				Whether you’re an artist, a traveler, or an entrepreneur, you’ll find space here to connect,
				contribute, and belong.
			</p>
			<p>This is more than an accelerator — it’s a new cultural OS for Africa and her diaspora.</p>
		</div>
	</section>

	<!-- CTA -->
	<CTASection />
</div>

<style>
	body,
	html {
		margin: 0;
		padding: 0;
		width: 100%;
		max-width: 100vw;
		overflow-x: hidden;
		font-family: 'Inter', sans-serif;
	}

	/* Responsive tweaks */
	@media (max-width: 768px) {
		h2 {
			font-size: 1.8rem;
		}
		.pillar-card {
			flex-direction: column !important;
		}
		.pillar-image img {
			height: 220px !important;
		}
	}
	@media (orientation: landscape) and (max-width: 900px) {
		.landing {
			padding-bottom: 4rem;
		}
		.pillar-card {
			gap: 2rem;
		}
	}
	@media (min-width: 1024px) {
		h2 {
			font-size: 2.5rem;
		}
	}
</style>
