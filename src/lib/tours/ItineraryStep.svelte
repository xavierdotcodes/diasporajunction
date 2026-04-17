<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/tours/ItineraryStep.svelte');

	let { step, index } = $props();

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const stepEl = document.querySelector(`#step-${index}`);
		const content = stepEl.querySelector('.step-content');
		const image = stepEl.querySelector('.step-image');
		const dir = index % 2 === 0 ? -1 : 1;

		gsap.from(content, {
			scrollTrigger: {
				trigger: stepEl,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			},
			x: dir * -120,
			opacity: 0,
			duration: 0.8,
			ease: 'power3.out'
		});

		gsap.from(image, {
			scrollTrigger: {
				trigger: stepEl,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			},
			x: dir * 120,
			opacity: 0,
			duration: 0.9,
			delay: 0.06,
			ease: 'power3.out'
		});
	});
</script>

<div
	id="step-{index}"
	class="itinerary-step grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center"
>
	<!-- Image -->
	<div
		class="step-image rounded-xl overflow-hidden shadow-lg w-full"
		class:md:order-1={index % 2 === 0}
		class:md:order-2={index % 2 !== 0}
	>
		<img
			alt={step.title}
			src={step.image}
			loading="lazy"
			class="w-full h-64 sm:h-72 md:h-72 lg:h-80 object-cover block"
		/>
	</div>

	<!-- Text content -->
	<div
		class="step-content bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow"
		class:md:order-2={index % 2 === 0}
		class:md:order-1={index % 2 !== 0}
	>
		<div class="text-sm sm:text-base text-gray-500 font-medium mb-1">{step.day}</div>
		<h3 class="text-xl sm:text-2xl font-bold mb-3 text-[#F29F05] leading-snug">{step.title}</h3>
		<p class="leading-relaxed text-gray-700 mb-4 text-sm sm:text-base">{step.copy}</p>

		<ul class="text-xs sm:text-sm text-gray-600 space-y-1">
			<li>• Local guide & translator</li>
			<li>• All transport and entrance fees included</li>
			<li>• Dietary accommodations available on request</li>
		</ul>
	</div>
</div>
