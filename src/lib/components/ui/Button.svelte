<script>
	import { cn } from '$lib/utils/cn.js';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/components/ui/Button.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {any} [href]
	 * @property {string} [type]
	 * @property {string} [variant]
	 * @property {string} [size]
	 * @property {string} [className]
	 * @property {any} [ariaLabel]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props & { [key: string]: any }} */
	let {
		href = undefined,
		type = 'button',
		variant = 'default',
		size = 'default',
		className = '',
		ariaLabel = undefined,
		children,
		...rest
	} = $props();

	const variants = {
		default:
			'bg-[#0B0B0B] text-white hover:bg-[#171717] focus-visible:ring-[#0B0B0B]',
		ghost:
			'bg-transparent text-[#111111] hover:bg-[#F4EFE2] hover:text-[#111111] focus-visible:ring-[#C98E00]',
		brand:
			'bg-[#038C25] text-white hover:bg-[#026B1D] focus-visible:ring-[#038C25]',
		outline:
			'border border-[#E7E1D3] bg-white text-[#111111] hover:border-[#0B0B0B] hover:bg-[#F4EFE2] focus-visible:ring-[#C98E00]'
	};

	const sizes = {
		default: 'h-10 px-5 py-2 text-sm',
		sm: 'h-9 px-4 text-[0.78rem]',
		lg: 'h-12 px-6 text-sm',
		icon: 'h-10 w-10'
	};

	let classes = $derived(cn(
		'inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-[0.14em] transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100',
		variants[variant] ?? variants.default,
		sizes[size] ?? sizes.default,
		className
	));
</script>

{#if href}
	<a href={href} class={classes} aria-label={ariaLabel} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={classes} aria-label={ariaLabel} {...rest}>
		{@render children?.()}
	</button>
{/if}
