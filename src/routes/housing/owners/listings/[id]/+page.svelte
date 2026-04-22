<script>
	import HousingOwnerListingEditor from '$lib/components/housing/HousingOwnerListingEditor.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('housing.owner.editor.page');

	let { data, form } = $props();
</script>

<section class="owner-editor-page">
	<div class="shell">
		<HousingOwnerListingEditor
			listing={data.listing}
			viewer={data.housingViewer}
			ownerListingFeeUsd={data.ownerListingFeeUsd}
			{form}
			checkoutResult={data.checkoutResult}
		/>
	</div>
</section>

<style>
	.owner-editor-page {
		padding: 2rem 0 4rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.shell {
		width: min(100%, 84rem);
		margin: 0 auto;
		padding: 0 1.25rem;
	}
</style>
