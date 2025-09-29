<script>
	export let tour;
</script>

<div
	class="tour-item p-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-blue-400"
>
	<div class="flex justify-between items-center">
		<h3 class="font-bold text-lg md:text-xl truncate">{tour.name}</h3>
		<span class="text-sm md:text-base font-medium bg-white/20 px-3 py-1 rounded-full">
			{new Date(tour.startDate).toLocaleDateString()} - {new Date(
				tour.endDate
			).toLocaleDateString()}
		</span>
	</div>
	<p class="mt-2 text-white/80 text-sm md:text-base">
		Price: ${tour.price.toFixed(2)}
	</p>
</div>

<style>
	.tour-item {
		width: 100%;
		box-sizing: border-box;
	}
	.tour-item:hover {
		transform: translateY(-2px);
	}
</style>
