<script>
	export let tour;
</script>

<div class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer transition">
	<h3 class="font-bold">{tour.name}</h3>
	<p>
		{new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
	</p>
</div>
