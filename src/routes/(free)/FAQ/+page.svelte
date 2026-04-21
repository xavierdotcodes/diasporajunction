<script>
	import { slide } from 'svelte/transition';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.faq.page');

	let faqCategories = [
		{
			title: 'Tour Info',
			items: [
				{
					question: 'What’s included in each tour package?',
					answer:
						'Accommodations, transportation, all activities, tour guides, and daily breakfast are included in all packages.'
				},
				{
					question: 'How much money should I bring?',
					answer:
						'Your main expenses will be lunch/dinner and souvenirs. A conservative estimate is $500 per person, but $1,000/person is a safer budget.'
				},
				{
					question: 'How many people are on a typical tour?',
					answer: 'Tours usually have 12 participants, but numbers can range from 10 to 21.'
				},
				{
					question: 'How do I book a tour?',
					answer:
						"All bookings are handled on earthseedtours.com. Choose your tour and click 'Book This Tour.'"
				},
				{
					question: 'How do I pay?',
					answer:
						'Payments are made through the website at checkout using your preferred credit or debit card.'
				}
			]
		},
		{
			title: 'Preparation',
			items: [
				{
					question: 'How should I dress?',
					answer: 'Dress for tropical weather (85–90°F). Bring long sleeves for cooler evenings.'
				},
				{
					question: 'How do I get airline tickets?',
					answer:
						'Book directly with airlines or through a travel agent. We can advise on recommended flights.'
				},
				{
					question: 'How much is a Ghana visa?',
					answer: 'Single entry: $60 | Multiple entry: $100'
				},
				{
					question: 'How do I get a visa?',
					answer:
						'Apply at your nearest Ghanaian embassy. Guidance is provided, or visit https://ghanaembassydc.org/visa/'
				},
				{
					question: 'Do I need vaccinations?',
					answer:
						'Yellow fever vaccination is required. If not vaccinated, a $40 fine applies. Average vaccination cost is $200.'
				}
			]
		},
		{
			title: 'Policies',
			items: [
				{
					question: 'What is the refund policy?',
					answer:
						'0–30 days: 100% refund | 31–60 days: 90% refund | 61–90 days: 80% refund | 91+ days: 60% refund. Refunds are not issued within 60 days of the tour date. Request via info@earthseedtours.com. Processed within 14 business days.'
				},
				{
					question: 'Are children welcome?',
					answer: 'Yes, on family tours only, and must be accompanied by a parent.'
				},
				{
					question: 'Do you accommodate travelers with disabilities?',
					answer:
						'Travelers with disabilities must bring a companion to provide assistance. Most facilities in Ghana are not wheelchair accessible.'
				}
			]
		}
	];

	let openIndex = $state(null);
	function toggle(faq) {
		openIndex = openIndex === faq ? null : faq;
	}
</script>

<div class="hero">
	<h1>Frequently Asked Questions</h1>
</div>

<div class="faq-container">
	{#each faqCategories as category}
		<div class="category">
			<h2>{category.title}</h2>
			{#each category.items as faq}
				<button
					type="button"
					class="faq-item"
					aria-expanded={openIndex === faq}
					onclick={() => toggle(faq)}
				>
					<div class="faq-question">
						{faq.question}
						<span class="arrow" class:open={openIndex === faq}>▼</span>
					</div>
					{#if openIndex === faq}
						<div class="faq-answer" transition:slide>{faq.answer}</div>
					{/if}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.hero {
		font-family: 'Helvetica Neue', Arial, sans-serif;
		color: #0f172a;
		background: #000;
		padding: 5rem 1rem 3rem;
		text-align: center;
	}
	.hero h1 {
		font-size: 3rem;
		font-weight: 900;
		background: linear-gradient(90deg, #f2a007, #f27405, #d9042b);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.faq-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem 1rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
	}
	.category h2 {
		font-size: 2rem;
		color: #f2a007;
		margin-bottom: 1rem;
		border-bottom: 2px solid #d9042b;
		padding-bottom: 0.5rem;
	}
	.faq-item {
		background: #fdfdfd; /* very light gray for contrast */
		border-left: 6px solid #038c25; /* green accent */
		border-top: none;
		border-right: none;
		border-bottom: none;
		text-align: left;
		width: 100%;
		border-radius: 0.75rem;
		padding: 1rem 1.25rem;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition:
			transform 0.15s,
			box-shadow 0.15s,
			background 0.2s;
	}
	.faq-item:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		background: #fff5e6; /* subtle warm hover tint */
	}
	.faq-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 700;
		font-size: 1.15rem;
		color: #1a1a1a; /* darker question text */
	}
	.faq-answer {
		margin-top: 0.5rem;
		line-height: 1.7;
		font-size: 1rem;
		color: #333; /* darker answer text */
	}
	.arrow {
		color: #038c25;
		transition: transform 0.3s;
	}
	.arrow.open {
		transform: rotate(180deg);
	}
</style>
