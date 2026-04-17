function prefersReducedMotion() {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getRevealGroups(node) {
	const candidates = Array.from(node.querySelectorAll('section, [data-reveal], [data-reveal-group]'));

	return candidates.filter((element) => {
		if (!(element instanceof HTMLElement)) return false;
		if (element.closest('[data-no-reveal]')) return false;

		const parentGroup = element.parentElement?.closest('section, [data-reveal], [data-reveal-group]');
		return !parentGroup || parentGroup === node;
	});
}

function getRevealItems(group) {
	const scope =
		group.children.length === 1 && group.firstElementChild instanceof HTMLElement
			? group.firstElementChild
			: group;

	const directChildren = Array.from(scope.children).filter(
		(element) => element instanceof HTMLElement && !element.hasAttribute('data-no-reveal')
	);

	if (directChildren.length >= 2 && directChildren.length <= 8) {
		return directChildren;
	}

	return [group];
}

function cleanupGroup(group) {
	group.classList.remove('motion-reveal-group', 'is-revealed');

	const items = Array.from(group.querySelectorAll('.motion-reveal-item'));
	for (const item of items) {
		item.classList.remove('motion-reveal-item', 'is-revealed');
		item.style.removeProperty('--reveal-delay');
	}
}

export function autoReveal(node, options = {}) {
	if (typeof window === 'undefined') {
		return {
			destroy() {}
		};
	}

	const stagger = options.stagger ?? 85;
	const threshold = options.threshold ?? 0.18;
	const rootMargin = options.rootMargin ?? '0px 0px -8% 0px';
	const reduceMotion = prefersReducedMotion();
	const groups = getRevealGroups(node);

	for (const group of groups) {
		group.classList.add('motion-reveal-group');

		const items = getRevealItems(group);
		items.forEach((item, index) => {
			item.classList.add('motion-reveal-item');
			item.style.setProperty('--reveal-delay', `${index * stagger}ms`);
		});
	}

	if (reduceMotion) {
		for (const group of groups) {
			group.classList.add('is-revealed');
			for (const item of getRevealItems(group)) {
				item.classList.add('is-revealed');
			}
		}

		return {
			destroy() {
				for (const group of groups) cleanupGroup(group);
			}
		};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;

				entry.target.classList.add('is-revealed');

				const items = getRevealItems(entry.target);
				for (const item of items) {
					item.classList.add('is-revealed');
				}

				observer.unobserve(entry.target);
			}
		},
		{
			threshold,
			rootMargin
		}
	);

	for (const group of groups) {
		observer.observe(group);
	}

	return {
		destroy() {
			observer.disconnect();
			for (const group of groups) cleanupGroup(group);
		}
	};
}
