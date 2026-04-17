import { cubicOut } from 'svelte/easing';

const ENTER_EASE = cubicOut;
const EXIT_EASE = (t) => 1 - Math.pow(1 - t, 2.2);

function prefersReducedMotion() {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function pageFade(node, options = {}) {
	const {
		delay = 0,
		duration = prefersReducedMotion() ? 0 : 420,
		y = 26,
		start = 0.992,
		blur = 10,
		outro = false
	} = options;

	return {
		delay,
		duration,
		easing: outro ? EXIT_EASE : ENTER_EASE,
		css: (t) => {
			const eased = outro ? t : t;
			const opacity = eased;
			const translateY = (1 - eased) * y * (outro ? -0.35 : 1);
			const scale = 1 - (1 - eased) * (1 - start);
			const filterBlur = (1 - eased) * blur;

			return `
				opacity: ${opacity};
				transform: translate3d(0, ${translateY}px, 0) scale(${scale});
				filter: blur(${filterBlur}px);
			`;
		}
	};
}

export function veilFade(node, options = {}) {
	const { delay = 0, duration = prefersReducedMotion() ? 0 : 260 } = options;

	return {
		delay,
		duration,
		easing: ENTER_EASE,
		css: (t) => `opacity: ${t}; backdrop-filter: blur(${t * 8}px);`
	};
}

export function panelSlide(node, options = {}) {
	const {
		delay = 0,
		duration = prefersReducedMotion() ? 0 : 340,
		x = 24,
		scale = 0.985,
		blur = 8
	} = options;

	return {
		delay,
		duration,
		easing: ENTER_EASE,
		css: (t) => {
			const opacity = t;
			const translateX = (1 - t) * x;
			const panelScale = 1 - (1 - t) * (1 - scale);
			const filterBlur = (1 - t) * blur;

			return `
				opacity: ${opacity};
				transform: translate3d(${translateX}px, 0, 0) scale(${panelScale});
				filter: blur(${filterBlur}px);
			`;
		}
	};
}
