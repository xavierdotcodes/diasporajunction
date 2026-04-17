<script module>
	import { tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "h-7 gap-1.5 rounded-full border border-transparent px-3 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-all has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:size-3! focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:ring-[3px] [&>svg]:pointer-events-none",
		variants: {
			variant: {
				default: "border-[#C98E00]/20 bg-[#F2B705]/16 text-[#111111] [a]:hover:bg-[#F2B705]/24",
				secondary: "border-[#E7E1D3] bg-[#F4EFE2] text-[#111111] [a]:hover:bg-[#EDE5D3]",
				destructive: "border-[#D9042B]/18 bg-[#D9042B]/10 text-[#D9042B] [a]:hover:bg-[#D9042B]/16",
				outline: "border-border bg-transparent text-foreground [a]:hover:bg-[#F4EFE2]",
				ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
				link: "border-transparent px-0 text-[#C98E00] underline-offset-4 hover:underline",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});
</script>

<script>
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		children,
		...restProps
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
