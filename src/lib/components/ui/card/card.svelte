<script>
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = "default",
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	data-size={size}
	class={cn("border-border/80 bg-card text-card-foreground gap-4 overflow-hidden rounded-[1.75rem] py-5 text-xs/relaxed shadow-[0_18px_45px_rgba(11,11,11,0.06)] border has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-2 data-[size=sm]:py-4 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-[1.75rem] *:[img:last-child]:rounded-b-[1.75rem] group/card flex flex-col transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-[0_24px_60px_rgba(11,11,11,0.1)]", className)}
	{...restProps}
>
	{@render children?.()}
</div>
