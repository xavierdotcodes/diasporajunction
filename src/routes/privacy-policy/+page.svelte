<script>
	import Footer from '$lib/Footer.svelte';
	import { onMount } from 'svelte';
</script>

<div class="legal-container">
	<h1>Privacy Policy</h1>

	<h2>1. Introduction</h2>
	<p>
		This Privacy Policy explains how [Your Company Name] (“we,” “our,” or “us”) collects, uses,
		discloses, and safeguards your information when you use our website and services. We are
		committed to protecting your privacy and ensuring transparency in how your data is handled.
	</p>

	<h2>2. Information We Collect</h2>
	<h3>2.1 Personal Information</h3>
	<p>We may collect personal information you voluntarily provide, including:</p>
	<ul>
		<li>Name, email address, phone number, and shipping/billing details</li>
		<li>Payment details (processed securely by third-party providers)</li>
		<li>Account login credentials (if you create an account)</li>
	</ul>

	<h3>2.2 Non-Personal Information</h3>
	<p>We automatically collect certain data such as:</p>
	<ul>
		<li>IP address and device type</li>
		<li>Browser type, operating system, and access times</li>
		<li>Pages visited, referring websites, and clickstream data</li>
	</ul>

	<h2>3. How We Use Your Information</h2>
	<p>We use your data to:</p>
	<ul>
		<li>Provide, operate, and improve our website and services</li>
		<li>Process and fulfill orders, including payment and delivery</li>
		<li>Communicate with you regarding updates, promotions, or customer service</li>
		<li>Ensure security and prevent fraud</li>
		<li>Comply with legal obligations</li>
	</ul>

	<h2>4. Cookies and Tracking Technologies</h2>
	<p>
		We use cookies, pixels, and similar tracking tools to improve your browsing experience, analyze
		usage, and personalize content. You can control cookie settings in your browser, but disabling
		cookies may affect site functionality.
	</p>

	<h2>5. Sharing of Information</h2>
	<p>We do not sell your personal information. We may share information with:</p>
	<ul>
		<li>Service providers (payment processors, shipping partners, analytics tools)</li>
		<li>Legal authorities if required by law</li>
		<li>Business partners in case of mergers, acquisitions, or restructuring</li>
	</ul>

	<h2>6. Data Retention</h2>
	<p>
		We retain personal information only as long as necessary to fulfill the purposes outlined in
		this Policy, unless a longer retention period is required by law.
	</p>

	<h2>7. Data Security</h2>
	<p>
		We implement appropriate technical and organizational measures to protect your data. However, no
		method of transmission over the internet is 100% secure. Use of our services is at your own
		risk.
	</p>

	<h2>8. Your Rights</h2>
	<h3>8.1 GDPR (European Union)</h3>
	<p>
		If you are in the EU, you have the right to access, rectify, delete, or restrict processing of
		your personal data, as well as the right to data portability.
	</p>

	<h3>8.2 CCPA (California Residents)</h3>
	<p>
		California residents have the right to know what personal data we collect, request deletion of
		personal data, and opt out of the sale of personal data (we do not sell your data).
	</p>

	<h2>9. Third-Party Services</h2>
	<p>
		Our website may link to third-party services (e.g., payment gateways, analytics tools). We are
		not responsible for their privacy practices and encourage you to review their policies.
	</p>

	<h2>10. Children’s Privacy</h2>
	<p>
		Our services are not directed at children under 13 (or the minimum legal age in your
		jurisdiction). We do not knowingly collect personal data from children. If we discover we have
		done so, we will delete it immediately.
	</p>

	<h2>11. International Transfers</h2>
	<p>
		Your information may be transferred and stored on servers outside your country. By using our
		services, you consent to such transfers, subject to applicable laws.
	</p>

	<h2>12. Changes to This Policy</h2>
	<p>
		We may update this Privacy Policy from time to time. Updates will be posted here with a new
		effective date. Continued use of our services after changes means you accept the updated policy.
	</p>

	<h2>13. Contact Us</h2>
	<p>
		If you have questions, requests, or concerns about this Privacy Policy or our data practices,
		please contact us at:
	</p>
	<p>
		<strong>Email:</strong> info@diasporajunxion.com<br />
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
