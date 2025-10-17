<script>
	import { goto } from '$app/navigation';
	export let post;

	function openPost() {
		const el = document.getElementById(post.slug);
		el?.classList.add('zooming');

		setTimeout(() => {
			goto(`/blog/${post.slug}`);
		}, 300);
	}
</script>

<article
	id={post.slug}
	class="blog-card cursor-pointer relative overflow-hidden rounded-2xl shadow-md mb-6"
	on:click={openPost}
>
	<img
		src={post.cover}
		alt={post.title}
		class="w-full object-cover transition-transform duration-300 hover:scale-105"
	/>
	<div class="p-4 bg-white dark:bg-neutral-900">
		<h2 class="text-xl font-semibold mb-2">{post.title}</h2>
		<p class="text-sm text-neutral-500">{post.excerpt}</p>
	</div>
</article>

<style>
	.blog-card {
		width: 32%;
	}
	@media (max-width: 1024px) {
		.blog-card {
			width: 48%;
		}
	}
	@media (max-width: 640px) {
		.blog-card {
			width: 100%;
		}
	}
	.blog-card.zooming {
		transform: scale(1.05);
		transition: transform 0.3s ease;
	}
</style>
