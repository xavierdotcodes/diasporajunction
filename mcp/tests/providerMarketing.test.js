import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const providerPage = readFileSync('src/routes/providers/+page.svelte', 'utf8');
const applyPage = readFileSync('src/routes/apply/+page.svelte', 'utf8');
const layout = readFileSync('src/routes/+layout.svelte', 'utf8');
const ownerDashboardPage = readFileSync('src/routes/dashboard/listings/[id]/+page.svelte', 'utf8');

describe('provider landing page', () => {
	it('exists with an apply CTA and provider offer copy', () => {
		expect(providerPage).toContain('Get discovered by diaspora customers looking for trusted Ghana services.');
		expect(providerPage).toContain('Apply for a Founding Verified Listing');
		expect(providerPage).toContain('href="/apply"');
		expect(providerPage).toContain('Founding AI-searchable verified profile');
	});

	it('shows simple provider pricing without overpromising outcomes', () => {
		expect(providerPage).toContain('Simple provider plans');
		expect(providerPage).toContain('Founding Verified Listing');
		expect(providerPage).toContain('Featured Listing');
		expect(providerPage).toContain('Future Growth Plan');
		expect(providerPage).toContain('Coming soon');
		expect(providerPage).toContain('No external traffic or customer guarantee');
	});

	it('sets provider SEO metadata', () => {
		expect(providerPage).toContain('Get Listed on DiasporaJunxion | Verified Ghana Services Directory');
		expect(providerPage).toContain('verified, AI-searchable profile');
		expect(providerPage).toContain('rel="canonical"');
	});

	it('uses honest customer and AI placement expectations', () => {
		expect(providerPage).toContain('We cannot guarantee instant customers');
		expect(providerPage).toContain('does not mean');
		expect(providerPage).toContain('guaranteed ChatGPT placement');
		expect(providerPage).not.toMatch(/we guarantee instant customers/i);
		expect(providerPage).not.toMatch(/we guarantee .*traffic/i);
	});
});

describe('provider onboarding copy', () => {
	it('explains public media and private verification documents on apply', () => {
		expect(applyPage).toContain('Public profile media');
		expect(applyPage).toContain('can be shown publicly');
		expect(applyPage).toContain('Verification documents are reviewed by admins only and are not shown publicly');
		expect(applyPage).toContain('Payment is for the current application, verification, and listing review flow');
	});

	it('adds a provider CTA to global navigation', () => {
		expect(layout).toContain('href="/providers"');
		expect(layout).toContain('For providers');
	});

	it('shows owner plan and upgrade entry points', () => {
		expect(ownerDashboardPage).toContain('Plan and visibility');
		expect(ownerDashboardPage).toContain('/upgrade');
		expect(ownerDashboardPage).toContain('Manage upgrade');
	});
});
