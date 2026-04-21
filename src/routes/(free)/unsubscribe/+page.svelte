<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>Unsubscribe | DiasporaJunxion</title>
</svelte:head>

<section class="bg-[#fff8e1] px-6 py-24 text-black">
	<div class="mx-auto max-w-3xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm md:p-12">
		<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#D9042B]">DiasporaJunxion</p>
		<h1 class="mt-4 text-3xl font-extrabold md:text-5xl">
			{data.success ? 'You are unsubscribed' : 'We could not process that request'}
		</h1>
		<p class="mt-5 max-w-2xl text-base leading-7 text-black/70 md:text-lg">
			{data.message}
		</p>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row">
			<a
				href="/start-here"
				class="inline-flex items-center justify-center rounded-full bg-[#038C25] px-5 py-3 text-sm font-semibold text-white hover:bg-[#02701d]"
			>
				Back to Start Here
			</a>
			<a
				href="/blog"
				class="inline-flex items-center justify-center rounded-full border border-black/10 bg-[#f8f2dd] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f3ead1]"
			>
				Read The Blog
			</a>
		</div>
	</div>
</section>
