<script>
	import { onMount } from 'svelte';
</script>

<div class="legal-container">
	<h1>Shipping Policy</h1>

	<h2>1. Processing Times</h2>
	<p>
		Orders are typically processed within <strong>2–3 business days</strong> after payment is received.
		Orders placed on weekends or holidays will be processed the next business day.
	</p>

	<h2>2. Shipping Rates</h2>
	<p>
		Shipping costs are calculated at checkout based on the weight of your order, delivery location,
		and selected shipping method. Occasionally, we may offer free shipping promotions which will be
		clearly stated on our website.
	</p>

	<h2>3. Estimated Delivery Times</h2>
	<ul>
		<li><strong>Domestic (within Ghana):</strong> 3–7 business days</li>
		<li>
			<strong>International:</strong> 7–21 business days, depending on destination and customs processing
		</li>
	</ul>
	<p>Please note that these are estimates and actual delivery times may vary.</p>

	<h2>4. Order Tracking</h2>
	<p>
		Once your order has shipped, you will receive a confirmation email with a tracking number and
		link to monitor your shipment’s progress.
	</p>

	<h2>5. Customs, Duties & Taxes</h2>
	<p>
		International orders may be subject to import duties, taxes, and fees imposed by your local
		government. These charges are the responsibility of the customer and are not included in the
		product or shipping price.
	</p>

	<h2>6. Delays</h2>
	<p>
		We are not responsible for shipping delays caused by carriers, customs, natural events, or
		incorrect shipping information provided by the customer. However, we will assist you in
		resolving issues where possible.
	</p>

	<h2>7. Lost or Damaged Packages</h2>
	<p>
		If your package is lost or arrives damaged, please contact us within <strong>7 days</strong> of delivery.
		We may request photos of damaged items to help process claims with the carrier.
	</p>

	<h2>8. Address Accuracy</h2>
	<p>
		Please ensure your shipping address is correct at checkout. We cannot be responsible for
		packages delivered to incorrect addresses provided by the customer.
	</p>

	<h2>9. Changes to This Shipping Policy</h2>
	<p>
		We may update this Shipping Policy from time to time. Updates will be posted on this page with
		the effective date indicated. Continued use of our services after updates means you accept the
		revised policy.
	</p>

	<h2>10. Contact Us</h2>
	<p>If you have any questions regarding shipping or your order, please contact us at:</p>
	<p>
		<strong>Email:</strong> info@diasporajunxion.com<br />
	</p>
</div>

<style>
	.legal-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2.5rem;
		background-color: #1e293b;
		border-radius: 12px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
		color: #f8fafc;
		line-height: 1.8;
	}
	h1,
	h2,
	h3 {
		color: #ffffff;
		margin-bottom: 1.5rem;
		line-height: 1.4;
	}
	h1 {
		font-size: 2.25rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}
	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2.5rem;
	}
	h3 {
		font-size: 1.25rem;
		font-weight: 500;
		margin-top: 2rem;
	}
	p,
	li {
		color: #d1d5db;
		margin-bottom: 1.25rem;
		font-size: 1.05rem;
	}
	ul,
	ol {
		margin-left: 1.75rem;
		margin-bottom: 1.75rem;
	}
	li {
		margin-bottom: 0.75rem;
	}

	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.legal-container {
			padding: 1.5rem;
			margin: 1rem;
			border-radius: 8px;
		}
		h1 {
			font-size: 1.75rem;
		}
		h2 {
			font-size: 1.25rem;
			margin-top: 2rem;
		}
		h3 {
			font-size: 1.1rem;
		}
		p,
		li {
			font-size: 0.95rem;
			margin-bottom: 1rem;
		}
		ul,
		ol {
			margin-left: 1.25rem;
		}
	}
</style>
