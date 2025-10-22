<script>
	export let src = '/images/logos/logo-optimized.png';
	export let width = '100'; // default width
	export let alt = 'Diaspora Junxion Logo';
</script>

<div class="logo">
	<a href="/">
		<img {src} {alt} {width} />
	</a>
</div>

<style>
	.logo img {
		display: block;
		height: auto;
		max-width: 100%;
	}
</style>
