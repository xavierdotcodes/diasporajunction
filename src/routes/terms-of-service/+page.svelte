<script>
	import { onMount } from 'svelte';
	import Footer from '$lib/Footer.svelte';
</script>

<div class="legal-container">
	<h1>Terms of Service</h1>

	<h2>1. Introduction</h2>
	<p>
		Welcome to our website. By accessing or using our services, you agree to be bound by these Terms
		of Service. Please read them carefully.
	</p>

	<h2>2. Use of Our Services</h2>
	<p>
		You agree to use our website and services only for lawful purposes and in accordance with these
		Terms. You may not use our services in any manner that could damage, disable, overburden, or
		impair the site.
	</p>

	<h2>3. Accounts</h2>
	<p>
		If our services require you to create an account, you must provide accurate and complete
		information. You are responsible for maintaining the confidentiality of your account
		credentials.
	</p>

	<h2>4. Intellectual Property</h2>
	<p>
		All content, trademarks, and data on this website, including but not limited to software,
		databases, text, graphics, icons, and hyperlinks, are the property of the company and are
		protected by intellectual property laws.
	</p>

	<h2>5. Limitation of Liability</h2>
	<p>
		We are not liable for any damages that may occur from the use of our website or services. This
		includes direct, indirect, incidental, consequential, or punitive damages.
	</p>

	<h2>6. Termination</h2>
	<p>
		We reserve the right to suspend or terminate your access to our services at any time, without
		prior notice or liability, for any reason whatsoever.
	</p>

	<h2>7. Changes to Terms</h2>
	<p>
		We may modify these Terms at any time. Any changes will be posted on this page with an updated
		revision date. Your continued use of our services constitutes your acceptance of the revised
		Terms.
	</p>

	<h2>8. Governing Law</h2>
	<p>
		These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
		in which our company is based, without regard to its conflict of law principles.
	</p>

	<h2>9. Contact Us</h2>
	<p>
		If you have any questions about these Terms, please contact us through our website's contact
		form.
	</p>
</div>
<Footer />

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
