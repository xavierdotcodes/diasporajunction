<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import NDGORegistrationModal from '$lib/NDGORegistrationModal.svelte';

	let showModal = false;

	onMount(async () => {
		gsap.from('.ndgo-hero span', {
			y: 40,
			opacity: 0,
			stagger: 0.15,
			duration: 1,
			ease: 'power4.out'
		});

		gsap.from('.ndgo-cta', {
			scale: 0.8,
			opacity: 0,
			delay: 1.5,
			duration: 0.6,
			ease: 'back.out(1.7)'
		});
	});
</script>

<!-- Hero -->
<section class="bg-white py-20 px-8 text-center">
	<h2 class="ndgo-hero text-4xl font-extrabold text-black mb-4">
		<span class="text-[#D9042B]">N.D.G.O.</span>
		<span class="text-[#038C25]">Program</span>
	</h2>
	<p class="text-lg text-gray-700 max-w-xl mx-auto mb-6">
		<span class="text-[#F27405] font-semibold">Analog · Digital · Pedagogy</span> — a new way to learn
		computers through art, and art through computers.
	</p>
	<a
		class="ndgo-cta inline-block bg-[#D9042B] text-white px-6 py-3 rounded-full font-bold shadow hover:scale-105 transition cursor-pointer"
		on:click={() => (showModal = true)}
	>
		Join the Program
	</a>
</section>

<!-- Other Sections -->
<section id="vision" class="py-16 bg-white px-8">
	<h3 class="text-3xl font-bold text-black mb-8 text-center">Why N.D.G.O.?</h3>
	<div class="max-w-3xl mx-auto text-gray-700 space-y-4 text-lg">
		<p>
			In Sekondi and across Ghana, we’ve seen how art is often treated as secondary — a hobby, not a
			discipline. This lack of appreciation stifles not just creativity, but also
			<span class="text-[#038C25] font-semibold">self-expression</span>.
		</p>
		<p>
			N.D.G.O. exists to flip that script. By blending art, math, and computer science, we help
			children, teens, and adults unlock expression, confidence, and technical skills at the same
			time.
		</p>
		<p>
			Art and code aren’t opposites. They’re languages — and when you learn to speak both, you
			discover new freedom.
		</p>
	</div>
</section>

<section id="how" class="py-16 bg-[#F2B705]/10 px-8">
	<h3 class="text-3xl font-bold text-black mb-10 text-center">How We Teach</h3>
	<div class="grid md:grid-cols-3 gap-6">
		<div class="bg-white p-6 rounded-xl border border-[#F2B705] shadow-sm">
			<h4 class="text-xl font-bold text-[#D9042B] mb-2">Analog</h4>
			<p class="text-gray-700">
				Hands-on drawing, painting, music, and storytelling — the roots of creativity.
			</p>
		</div>
		<div class="bg-white p-6 rounded-xl border border-[#F2B705] shadow-sm">
			<h4 class="text-xl font-bold text-[#038C25] mb-2">Digital</h4>
			<p class="text-gray-700">
				Computers, coding, and design tools that turn imagination into real-world projects.
			</p>
		</div>
		<div class="bg-white p-6 rounded-xl border border-[#F2B705] shadow-sm">
			<h4 class="text-xl font-bold text-[#F27405] mb-2">Pedagogy</h4>
			<p class="text-gray-700">
				Playful, collaborative learning methods that empower expression at every age.
			</p>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 bg-white text-center px-8">
	<h3 class="text-3xl font-bold text-black mb-6">Be Part of N.D.G.O.</h3>
	<p class="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
		Join a movement that treats <span class="text-[#F27405] font-semibold">art</span> and
		<span class="text-[#038C25] font-semibold">computers</span> as equal partners in expression and empowerment.
	</p>
	<a
		class="inline-block bg-[#038C25] text-white px-6 py-3 rounded-full font-bold hover:bg-[#026b1d] transition cursor-pointer"
		on:click={() => (showModal = true)}
	>
		Join the Program
	</a>
</section>

<NDGORegistrationModal bind:showModal onClose={() => (showModal = false)} />

<style>
	section {
		scroll-margin-top: 100px;
	}
</style>
