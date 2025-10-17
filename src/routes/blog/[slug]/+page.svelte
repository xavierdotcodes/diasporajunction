<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let post = { title: 'Loading...', content: '', cover: '' };
	$: slug = $page.params.slug;

	onMount(() => {
		post = {
			title: 'NDGO: The Art of Growth',
			content: `
				<p>NDGO is our art residency redefining creative growth through flow state and embodied collaboration. Artists live, move, and make in rhythm with Ghana’s heartbeat.</p>
				<p>This is not just a retreat — it’s an awakening.</p>
			`,
			cover: '/images/blog3.jpg'
		};

		gsap.from('.post-header, .post-body', {
			y: 40,
			opacity: 0,
			duration: 0.8,
			stagger: 0.2,
			ease: 'power3.out'
		});
	});

	function goBack() {
		gsap.to('.post-container', {
			opacity: 0,
			duration: 0.3,
			onComplete: () => goto('/blog')
		});
	}
</script>

<div class="post-container p-6 md:p-12">
	<button on:click={goBack} class="mb-6 text-sm text-neutral-400 hover:text-neutral-200"
		>← Back</button
	>

	<div class="post-header mb-6">
		<img src={post.cover} alt={post.title} class="w-full rounded-2xl mb-4" />
		<h1 class="text-4xl font-bold">{post.title}</h1>
	</div>

	<div class="post-body text-lg">
		{@html post.content}
	</div>
</div>
