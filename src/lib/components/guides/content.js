import { allGuides } from './data.js';

const specificGuideContent = {
	'start-here': {
		readTime: '6 min read',
		category: 'Start Here',
		lede:
			'The first right move is not speed. It is clarity about what kind of Ghana question you are really holding.',
		sections: [
			{
				title: 'Name the season you are in',
				paragraphs: [
					'Some people are feeling a pull toward Ghana for identity reasons. Others are thinking about family, peace, schooling, or opportunity. Those are different entry points, and they need different kinds of next steps.',
					'When all of those motives get blended together too quickly, people start treating one emotional surge like a complete life plan. The better move is to separate the questions before you try to answer them.'
				]
			},
			{
				title: 'Distinguish curiosity from commitment',
				paragraphs: [
					'You do not need to decide everything at once. You need to know whether you are at the stage of curiosity, testing, planning, or actual relocation.',
					'That distinction changes what kind of information is useful and what kind of support you should reach for next.'
				]
			}
		]
	},
	'visiting-vs-living-in-ghana': {
		readTime: '7 min read',
		category: 'Relocation Basics',
		lede:
			'The energy of a visit is not the same thing as the rhythm of a life. That gap is where many relocation fantasies begin.',
		sections: [
			{
				title: 'Visits compress the best parts',
				paragraphs: [
					'Short stays tend to intensify social energy, novelty, movement, and cultural excitement. They usually do not show you the maintenance layer of daily life.',
					'That means a visit can be emotionally true without being a complete preview of what long-term living feels like.'
				]
			},
			{
				title: 'Living asks different questions',
				paragraphs: [
					'Living raises questions about systems: housing, transport, schooling, healthcare, money flow, routine, and how much friction your nervous system can absorb.',
					'The move gets more grounded once you stop asking whether Ghana feels good and start asking whether your actual life can hold here.'
				]
			}
		]
	},
	'moving-to-ghana-with-kids': {
		readTime: '8 min read',
		category: 'Family & Lifestyle',
		lede:
			'Family relocation is not just an adult dream with children attached. The support structure matters as much as the destination.',
		sections: [
			{
				title: 'Children experience transitions differently',
				paragraphs: [
					'Adults can romanticize the move because they are focused on meaning, belonging, or opportunity. Children usually feel the move through routine, safety, relationships, and stability.',
					'That is why family relocation needs a slower, more systems-aware approach than solo relocation.'
				]
			},
			{
				title: 'Think in support systems, not just schools',
				paragraphs: [
					'Schooling matters, but so do transportation patterns, family rhythm, trusted adults, health access, and how much practical support exists around the household.',
					'The more clearly those systems are mapped, the softer the landing tends to be.'
				]
			}
		]
	},
	'cost-of-living-in-ghana': {
		readTime: '6 min read',
		category: 'Relocation Basics',
		lede:
			'Cost of living questions are rarely just about price. They are about lifestyle, location, family needs, and the kind of friction you are willing to carry.',
		sections: [
			{
				title: 'There is no single Ghana budget',
				paragraphs: [
					'What you spend depends heavily on neighborhood, transport choices, schooling, housing standards, imported preferences, and how local or international your routines are.',
					'That means cost questions need scenarios, not one average number that pretends to cover everyone.'
				]
			},
			{
				title: 'What matters is sustainability',
				paragraphs: [
					'The better question is not “what is the cheapest way to do this?” It is “what level of life can I sustain without building constant pressure into the move?”',
					'That framing makes financial planning more honest and more useful.'
				]
			}
		]
	}
};

function titleFromSlug(slug) {
	return slug
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function buildFallbackSections(guide) {
	return [
		{
			title: 'Start with the question in front of you',
			paragraphs: [
				`${guide.title} is here to help you get your bearings before the decision gets bigger, more emotional, or more expensive.`,
				'Use a piece like this to slow down, name what matters, and understand the terrain more clearly before you treat one article like a complete plan.'
			]
		},
		{
			title: 'Know what you still need next',
			paragraphs: [
				'Reading can help you get clearer, but some questions need more current information, better context, or support that depends on trust and timing.',
				'That is usually the point where the next step is not just another article, but a better support layer.'
			]
		}
	];
}

export function getGuideDetail(slug) {
	const guide =
		allGuides.find((item) => item.href === `/blog/${slug}`) ??
		allGuides.find((item) => item.href === `/guides/${slug}`) ??
		allGuides.find((item) => item.title.toLowerCase() === titleFromSlug(slug).toLowerCase());

	if (!guide) return null;

	const content = specificGuideContent[slug];
	const category = content?.category ?? guide.category;

	return {
		...guide,
		slug,
		category,
		readTime: content?.readTime ?? '5 min read',
		lede:
			content?.lede ??
			`${guide.description} Start here if you want a calmer, more grounded way to think through the question before you make a bigger move.`,
		sections: content?.sections ?? buildFallbackSections(guide),
		communityPreview: [
			{
				title: `${category} field notes`,
				description:
					'More current guidance for the questions that change once Ghana starts to feel less theoretical and more real.'
			},
			{
				title: 'Trusted next-step pathways',
				description:
					'Referrals, deeper resources, and more useful next steps once reading alone is no longer enough.'
			},
			{
				title: 'Lived intelligence',
				description:
					'Stories, nuance, and lessons from real experience that help the article connect to actual life.'
			},
			{
				title: 'Decision support',
				description:
					'Checklists, comparisons, and more structured help for people getting closer to action.'
			}
		]
	};
}

export function getRelatedGuides(slug, limit = 3) {
	return allGuides.filter((item) => item.href !== `/blog/${slug}`).slice(0, limit);
}
