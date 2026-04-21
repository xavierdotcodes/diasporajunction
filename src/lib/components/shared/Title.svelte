<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/components/shared/Title.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {string} [title]
	 * @property {string} [prefix]
	 * @property {string} [highlight]
	 * @property {string} [suffix]
	 * @property {'center' | 'left'} [align]
	 * @property {boolean} [stackOnMobile]
	 */

	/** @type {Props} */
	let {
		title = 'DiasporaJunxion',
		prefix = 'Diaspora',
		highlight = 'Junxion',
		suffix = '',
		align = 'center',
		stackOnMobile = false
	} = $props();

	const parts = $derived.by(() => {
		if (prefix || highlight || suffix) {
			return [
				{ text: prefix, type: 'prefix' },
				{ text: highlight, type: 'highlight' },
				{ text: suffix, type: 'suffix' }
			].filter((part) => part.text && part.text.trim().length);
		}

		if (!highlight || !title.includes(highlight)) {
			return [{ text: title, type: 'prefix' }];
		}

		const [before, after] = title.split(highlight);

		return [
			{ text: before, type: 'prefix' },
			{ text: highlight, type: 'highlight' },
			{ text: after, type: 'suffix' }
		].filter((part) => part.text && part.text.trim().length);
	});

</script>

<h1
	class:text-left={align === 'left'}
	class:text-center={align === 'center'}
	class:stack-mobile={stackOnMobile}
	class="title font-heading"
>
	{#each parts as part}
		<span
			data-title-part
			class:title-part={true}
			class:prefix={part.type === 'prefix'}
			class:highlight={part.type === 'highlight'}
			class:suffix={part.type === 'suffix'}
		>
			{part.text}
		</span>
	{/each}
</h1>

<style>
	.title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.16em;
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 800;
		line-height: 0.92;
		letter-spacing: -0.06em;
		text-wrap: balance;
	}

	.title.text-left {
		justify-content: flex-start;
		text-align: left;
	}

	.title.text-center {
		justify-content: center;
		text-align: center;
	}

	.title-part {
		display: inline-block;
		transform-origin: center center;
	}

	.prefix,
	.suffix {
		color: white;
		text-shadow:
			0 2px 22px rgba(0, 0, 0, 0.24),
			0 0 1px rgba(255, 255, 255, 0.05);
	}

	.highlight {
		color: #F2B705;
		text-shadow:
			0 2px 24px rgba(0, 0, 0, 0.24),
			0 0 18px rgba(242, 183, 5, 0.1);
	}

	@media (max-width: 768px) {
		.title {
			font-size: clamp(2.6rem, 12vw, 4.4rem);
			line-height: 0.98;
			letter-spacing: -0.045em;
			gap: 0.12em;
		}

		.title.stack-mobile {
			flex-direction: column;
			gap: 0;
		}
	}

	@media (max-width: 480px) {
		.title {
			font-size: clamp(2.35rem, 11vw, 3.4rem);
			letter-spacing: -0.04em;
		}
	}
</style>
