export async function revealOnScroll(target, opts = {}) {
	// guard for SSR
	if (typeof window === 'undefined') return;

	// dynamic import so it only runs in the browser
	const gsap = (await import('gsap')).default;
	const { ScrollTrigger } = await import('gsap/ScrollTrigger');
	gsap.registerPlugin(ScrollTrigger);

	const elements = Array.isArray(target) ? target : [target];

	elements.forEach((el) => {
		if (!el) return;

		const children = el.querySelectorAll('h2, p, button');
		if (!children.length) return;

		gsap.from(children, {
			scrollTrigger: {
				trigger: el,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			},
			y: 60,
			opacity: 0,
			stagger: 0.15,
			duration: 1,
			ease: 'power3.out',
			...opts
		});
	});
}
