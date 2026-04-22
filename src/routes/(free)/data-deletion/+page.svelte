<script>
	const supportEmail = 'support@diasporajunxion.com';
	const appName = 'DiasporaJunxion';
</script>

<svelte:head>
	<title>Data Deletion Instructions | {appName}</title>
	<meta
		name="description"
		content="Instructions for requesting deletion of your DiasporaJunxion account and associated personal data."
	/>
</svelte:head>

<div class="min-h-screen bg-white text-neutral-900">
	<div class="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-10">
		<div class="mb-10">
			<p class="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-red-600">
				Account & Data Requests
			</p>
			<h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Data Deletion Instructions</h1>
			<p class="mt-4 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
				If you created an account with {appName}, including through Facebook Login, you can request
				deletion of your account and associated personal data by contacting our support team.
			</p>
		</div>

		<div class="space-y-8">
			<section class="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
				<h2 class="text-xl font-semibold tracking-tight">How to request deletion</h2>
				<p class="mt-3 leading-7 text-neutral-700">
					Email us at
					<a
						class="font-medium text-red-600 underline decoration-red-300 underline-offset-4 hover:text-red-700"
						href={`mailto:${supportEmail}`}
					>
						{supportEmail}
					</a>
					and let us know that you want your account and associated data deleted.
				</p>
			</section>

			<section>
				<h2 class="text-xl font-semibold tracking-tight">Please include</h2>
				<ul class="mt-4 space-y-3 text-neutral-700">
					<li class="flex gap-3">
						<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500"></span>
						<span>Your full name</span>
					</li>
					<li class="flex gap-3">
						<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500"></span>
						<span>The email address associated with your account</span>
					</li>
					<li class="flex gap-3">
						<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500"></span>
						<span>A short note stating that you want your account and personal data deleted</span>
					</li>
				</ul>
			</section>

			<section>
				<h2 class="text-xl font-semibold tracking-tight">What happens next</h2>
				<div class="mt-4 space-y-4 text-neutral-700">
					<p>
						Once we receive your request, we may verify your identity before processing the
						deletion.
					</p>
					<p>
						After verification, we will delete or anonymize your account data from {appName}
						within a reasonable timeframe, unless we are required to retain certain information for legal,
						security, fraud prevention, or record-keeping purposes.
					</p>
				</div>
			</section>

			<section>
				<h2 class="text-xl font-semibold tracking-tight">Facebook Login users</h2>
				<p class="mt-4 leading-7 text-neutral-700">
					If you used Facebook Login to access {appName}, this process covers the deletion request
					for the data associated with your use of the app through Facebook as well.
				</p>
			</section>

			<section class="rounded-2xl border border-neutral-200 p-6 sm:p-8">
				<h2 class="text-xl font-semibold tracking-tight">Contact</h2>
				<p class="mt-3 leading-7 text-neutral-700">
					For deletion requests or questions about your data, contact
					<a
						class="ml-1 font-medium text-red-600 underline decoration-red-300 underline-offset-4 hover:text-red-700"
						href={`mailto:${supportEmail}`}
					>
						{supportEmail}
					</a>.
				</p>
			</section>
		</div>
	</div>
</div>
