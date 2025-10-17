<script>
	// instance script — this runs for each component instance (SSR + client)
	export let post;

	import { goto } from '$app/navigation';

	function openPost() {
		const el = document.getElementById(post.slug);
		el?.classList.add('zooming');

		// small delay for animation then navigate
		setTimeout(() => {
			goto(`/blog/${post.slug}`);
		}, 300);
	}
</script>

<article
	id={post.slug}
	class="blog-card cursor-pointer relative overflow-hidden rounded-2xl shadow-md transition-transform duration-300 bg-white dark:bg-neutral-900"
	on:click={openPost}
>
	<img src={post.cover} alt={post.title} class="w-full object-cover rounded-t-2xl" loading="lazy" />
	<div class="p-4">
		<h2 class="text-xl font-semibold mb-2">{post.title}</h2>
		<p class="text-sm text-neutral-500">{post.excerpt}</p>
	</div>
</article>

<style>
	.blog-card {
		display: block;
		width: 100%;
		break-inside: avoid;
		transition: transform 0.3s ease;
	}
	.blog-card:hover {
		transform: translateY(-4px);
	}
	.blog-card.zooming {
		transform: scale(1.05);
	}
</style>
