<script>
	import Footer from '$lib/layout/Footer.svelte';
	import { onMount } from 'svelte';
	onMount(() => window.scrollTo(0, 0));
</script>

<svelte:head>
	<title>Refund Policy</title>
	<meta
		name="description"
		content="Refund Policy for Diasporajunxion. Learn about our returns, refunds, and exchange process."
	/>
</svelte:head>

<section class="min-h-screen bg-slate-900 text-white px-6 md:px-16 py-12">
	<div class="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
		<h1 class="text-4xl font-extrabold text-center text-white mb-6">Refund Policy</h1>
		<p class="text-gray-300 text-center text-lg mb-10">
			We want you to be fully satisfied with your purchase. This Refund Policy explains how returns,
			refunds, and exchanges are handled by Diasporajunxion.
		</p>

		<div class="space-y-10 text-gray-300 leading-relaxed">
			<section>
				<h2 class="text-2xl font-bold text-white mb-3">Eligibility for Returns</h2>
				<p>
					You may request a return within <span class="font-semibold">30 days</span> of receiving your
					order if the item is unused, in its original packaging, and in the same condition that you
					received it.
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-bold text-white mb-3">Non-Returnable Items</h2>
				<p>Certain products cannot be returned, including:</p>
				<ul class="list-disc list-inside mt-3 space-y-2">
					<li>Gift cards</li>
					<li>Downloadable digital products</li>
					<li>Health and personal care items</li>
				</ul>
			</section>

			<section>
				<h2 class="text-2xl font-bold text-white mb-3">Refunds</h2>
				<p>
					Once your return is received and inspected, we will notify you of the approval or
					rejection of your refund. If approved, your refund will be processed and automatically
					applied to your original payment method within
					<span class="font-semibold">5–10 business days</span>.
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-bold text-white mb-3">Late or Missing Refunds</h2>
				<p>If you haven’t received a refund yet:</p>
				<ul class="list-disc list-inside mt-3 space-y-2">
					<li>First check your bank account again.</li>
					<li>
						Contact your credit card company—it may take time before your refund is officially
						posted.
					</li>
					<li>
						Next contact your bank. There is often some processing time before a refund is posted.
					</li>
				</ul>
				<p class="mt-3">
					If you’ve done all of this and still have not received your refund, please contact us at <a
						href="refunds@diasporajunxion.com"
						class="text-blue-400 hover:underline">refunds@diasporajunxion.com</a
					>.
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-bold text-white mb-3">Exchanges</h2>
				<p>
					We only replace items if they are defective or damaged. If you need to exchange an item
					for the same product, email us at
					<a href="mailto:returns@diassporajunxion.com" class="text-blue-400 hover:underline"
						>returns@diasporajunxion.com</a
					>.
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-bold text-white mb-3">Shipping Returns</h2>
				<p>
					To return your product, please mail it to: <span class="font-semibold"
						>returns@diasporajunxion.com</span
					>.
				</p>
				<p class="mt-3">
					You will be responsible for paying shipping costs for returning your item. Shipping costs
					are non-refundable.
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-bold text-white mb-3">Contact Us</h2>
				<p>For more information about our Refund Policy, please contact us at:</p>
				<p class="mt-2">
					<a href="mailto:info@diasporajunxion.com" class="text-blue-400 hover:underline"
						>info@diasporajunxion.com</a
					>
				</p>
			</section>
		</div>
	</div>
</section>
<Footer />
