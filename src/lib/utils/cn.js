import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/utils/cn.js');

export function cn(...classes) {
	return classes.filter(Boolean).join(' ');
}
