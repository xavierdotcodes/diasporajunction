export const memberBuckets = [
	{
		name: 'Pulse',
		summary: 'A current view of what is happening now across events, culture, relocation conditions, and business movement.',
		points: [
			'Events and gatherings worth tracking',
			'Business and relocation signals',
			'Cultural rhythm and on-the-ground movement'
		],
		access: 'Gated'
	},
	{
		name: 'Access',
		summary: 'Trusted providers, useful pathways, and a directory layer meant to save time and reduce avoidable friction.',
		points: [
			'Trusted service categories',
			'Referral and contact pathways',
			'Practical notes on how to move'
		],
		access: 'Gated'
	},
	{
		name: 'Lived Intelligence',
		summary: 'Stories, field notes, and real experience from diaspora people living, moving, and building in Ghana.',
		points: [
			'First-30/60/90-day lessons',
			'Expectation vs reality notes',
			'Belonging and adaptation patterns'
		],
		access: 'Gated'
	},
	{
		name: 'Tools',
		summary: 'More structured support for the questions that stop being simple after the first public reads.',
		points: [
			'Checklists and calculators',
			'Comparison and readiness tools',
			'Structured planning support'
		],
		access: 'Gated'
	},
	{
		name: 'Ask / Connect',
		summary: 'A place to surface deeper questions and build future support structures around real member needs.',
		points: [
			'Question intake',
			'Office-hours style scaffolding',
			'Discussion and support pathways'
		],
		access: 'Gated'
	}
];

export const memberWorkspaceLinks = [
	{
		label: 'Pulse',
		href: '#pulse',
		description: 'Current movement, event windows, and signal tracking.'
	},
	{
		label: 'Resources',
		href: '#resources',
		description: 'Premium planning packs, field notes, and member-only layers.'
	},
	{
		label: 'Tools',
		href: '#tools',
		description: 'Interactive support for relocation and family decision-making.'
	},
	{
		label: 'Ask / Connect',
		href: '#ask-connect',
		description: 'Relational support once the question needs real nuance.'
	}
];

export const resourceVaultItems = [
	{
		type: 'Member Briefing',
		title: 'Accra soft-landing pack',
		description:
			'A tighter member-only layer for first-arrival needs: what to line up before you land, what to delay, and where most people over-assume.',
		meta: 'Best for: first visits, trial stays, and early relocation planning',
		actionLabel: 'Use with Pulse',
		actionHref: '#pulse'
	},
	{
		type: 'Family Resource',
		title: 'Children and school scouting lens',
		description:
			'A structured family planning layer for rhythm, schooling questions, and what needs to feel stable before the move can feel sustainable.',
		meta: 'Best for: families and long-term planners',
		actionLabel: 'Open Tools',
		actionHref: '#tools'
	},
	{
		type: 'Field Notes',
		title: 'Belonging and social-entry notes',
		description:
			'A member-only set of observations on how connection tends to build in real life, and how to avoid mistaking access for actual belonging.',
		meta: 'Best for: first 90 days and social integration questions',
		actionLabel: 'Read Lived Intelligence',
		actionHref: '#lived-intelligence'
	},
	{
		type: 'Decision Support',
		title: 'Neighborhood and lifestyle question bank',
		description:
			'A framework for comparing what kind of life you are actually trying to build before you ask the wrong location question.',
		meta: 'Best for: housing, budget, and everyday rhythm decisions',
		actionLabel: 'Move to Access',
		actionHref: '#access'
	}
];

export const pulseEntries = [
	{
		tag: 'This Week',
		status: 'Live',
		title: 'Accra event window',
		summary:
			'Track the mix of cultural gatherings, diaspora meetups, and builder-friendly rooms that make the city feel navigable faster.',
		meta: 'Best used before a visit, trial stay, or first month in Accra.'
	},
	{
		tag: 'Relocation',
		status: 'Live',
		title: 'Arrival friction watch',
		summary:
			'Patterns members should watch around housing expectations, money flow, and the everyday friction that surfaces after the honeymoon phase.',
		meta: 'A current layer that public evergreen content cannot hold well.'
	},
	{
		tag: 'Business',
		status: 'Current',
		title: 'Builder signal scan',
		summary:
			'A lightweight read on where energy feels real, where caution is needed, and what looks worth a second conversation.',
		meta: 'Useful for members tracking opportunity without rushing into it.'
	}
];

export const accessEntries = [
	{
		tag: 'Housing',
		status: 'Trusted',
		title: 'Soft-landing resource layer',
		summary:
			'Provider categories and referral notes meant to help members move more carefully through housing, setup, and day-one logistics.',
		meta: 'Scaffolded for future directory and contact expansion.'
	},
	{
		tag: 'Family',
		status: 'Trusted',
		title: 'Family support pathways',
		summary:
			'The support categories families tend to need earlier than they expect, from schooling context to rhythm and stability questions.',
		meta: 'Useful once the move includes children and longer-term planning.'
	},
	{
		tag: 'Local Navigation',
		status: 'Curated',
		title: 'Trusted local connectors',
		summary:
			'A more careful layer around who helps members move well, where discernment matters, and how to avoid the wrong kind of dependence.',
		meta: 'Kept inside Community because trust degrades when flattened into open lists.'
	}
];

export const livedIntelligenceEntries = [
	{
		tag: 'First 30 Days',
		status: 'Member',
		title: 'What settles first, what takes longer',
		summary:
			'Patterns around routine, transport, social energy, housing, and the gap between emotional certainty and actual adaptation.',
		meta: 'Designed to help new arrivals normalize the transition.'
	},
	{
		tag: 'Belonging',
		status: 'Member',
		title: 'How connection really builds',
		summary:
			'Notes on how people move from being socially adjacent to actually feeling woven into place through repetition, rhythm, and the right rooms.',
		meta: 'Community is part of relocation, not a side topic.'
	},
	{
		tag: 'Perspective',
		status: 'Member',
		title: 'Expectation versus reality archive',
		summary:
			'Member stories and reflections meant to protect people from acting on fantasy alone while still honoring the beauty of the move.',
		meta: 'A stronger lens than polished public inspiration.'
	}
];

export const toolsEntries = [
	{
		tag: 'Planning',
		status: 'Live',
		title: 'Relocation readiness checklist',
		summary:
			'A structured sequence for people moving from curiosity into actual planning, with a focus on support systems and sustainability.',
		meta: 'Now paired with a live interactive checklist in the member workspace.'
	},
	{
		tag: 'Comparison',
		status: 'Member',
		title: 'Visit vs trial stay vs relocate comparison',
		summary:
			'A framework for clarifying what phase you are actually in before you confuse one with another.',
		meta: 'Useful for members who need better decision framing.'
	},
	{
		tag: 'Budget',
		status: 'Member',
		title: 'Lifestyle cost scenario tool',
		summary:
			'A scenario-based view of cost-of-living questions that avoids pretending there is one Ghana budget for everyone.',
		meta: 'Prepared as the next member tool to make interactive.'
	}
];

export const askConnectEntries = [
	{
		tag: 'Support',
		status: 'Open',
		title: 'Submit a question',
		summary:
			'Members can surface the questions that feel too situational or too current for a static public article.',
		meta: 'Next step: connect this to a real intake flow.'
	},
	{
		tag: 'Discussion',
		status: 'Scaffolded',
		title: 'Office-hours and guided discussion',
		summary:
			'A future structure for helping members move through the harder questions in a more relational, higher-trust setting.',
		meta: 'Built for deeper member support over time.'
	},
	{
		tag: 'Connection',
		status: 'Scaffolded',
		title: 'Member-to-member pattern library',
		summary:
			'A place for surfacing who has solved what, which questions recur, and where peer connection can reduce avoidable friction.',
		meta: 'A future connective layer rather than a public comment thread.'
	}
];
