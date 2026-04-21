<script>
	import SubscribeModal from '$lib/components/lead/Subscribe.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('layout.subscribe.component');

	let props = $props();
</script>

<SubscribeModal {...props} />
