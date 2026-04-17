<script module>
	import { cn } from "$lib/utils.js";
	import { tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-full border bg-clip-padding text-xs font-semibold uppercase tracking-[0.16em] focus-visible:ring-2 active:not-aria-[haspopup]:scale-[0.99] aria-invalid:ring-1 [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none select-none hover:-translate-y-[1px] disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground hover:bg-[#026B1D] focus-visible:ring-[#038C25]/35",
				outline: "border-border bg-white text-foreground hover:border-[#0B0B0B] hover:bg-[#F4EFE2] dark:bg-transparent dark:text-white dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10",
				secondary: "border-transparent bg-[#0B0B0B] text-white hover:bg-[#171717] focus-visible:ring-[#0B0B0B]/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/16",
				ghost: "border-transparent bg-transparent text-foreground hover:bg-black/6 hover:text-[#111111] dark:text-white dark:hover:bg-white/10",
				destructive: "border-transparent bg-[#D9042B] text-white hover:bg-[#B10323] focus-visible:ring-[#D9042B]/30",
				link: "border-transparent p-0 text-[#038C25] underline-offset-4 hover:text-[#026B1D] hover:underline",
			},
			size: {
				default: "h-10 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
				xs: "h-8 gap-1.5 px-3 text-[0.68rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-9 gap-1.5 px-4 text-[0.7rem] has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5 [&_svg:not([class*='size-'])]:size-3.5",
				lg: "h-12 gap-2 px-6 text-[0.72rem] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
				icon: "size-10",
				"icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-9",
				"icon-lg": "size-11",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

</script>

<script>
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	} = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
