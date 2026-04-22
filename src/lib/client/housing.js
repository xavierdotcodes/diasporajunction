import { env } from '$env/dynamic/public';
import { getSupabaseBrowserClient } from '$lib/supabase/client';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/lib/client/housing.js');
const MAX_HOUSING_IMAGES = 10;
const HOUSING_STORAGE_BUCKET =
	env.PUBLIC_HOUSING_STORAGE_BUCKET || env.PUBLIC_SUPABASE_STORAGE_BUCKET || 'housing-listings';

function sanitizeFileName(name) {
	return String(name || 'image')
		.toLowerCase()
		.replace(/[^a-z0-9.]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export async function uploadHousingImages({ files, listingId, supabaseUserId }) {
	const supabase = getSupabaseBrowserClient();

	if (!supabase) {
		throw new Error('Supabase auth is not configured yet.');
	}

	const fileList = Array.from(files || []).slice(0, MAX_HOUSING_IMAGES);
	const uploads = [];

	for (const [index, file] of fileList.entries()) {
		const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
		const path = `${supabaseUserId}/${listingId}/${Date.now()}-${index}-${crypto.randomUUID()}.${extension}`;
		const { error: uploadError } = await supabase.storage
			.from(HOUSING_STORAGE_BUCKET)
			.upload(path, file, {
				upsert: false,
				cacheControl: '3600'
			});

		if (uploadError) {
			log.error({
				op: 'upload_image',
				phase: 'error',
				path,
				error: serializeError(uploadError)
			});
			throw new Error(uploadError.message || 'Failed to upload listing image.');
		}

		const { data } = supabase.storage.from(HOUSING_STORAGE_BUCKET).getPublicUrl(path);

		uploads.push({
			url: data.publicUrl,
			storagePath: path,
			alt: sanitizeFileName(file.name).replace(/\.[a-z0-9]+$/, '').replace(/-/g, ' '),
			sortOrder: index
		});
	}

	log.info({
		op: 'upload_images',
		phase: 'success',
		count: uploads.length,
		listingId
	});

	return uploads;
}
