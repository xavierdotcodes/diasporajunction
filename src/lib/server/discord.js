// src/lib/server/discord.js
import { env } from '$env/dynamic/private';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/discord.js');

export function getDiscordWebhook() {
	if (!env.DISCORD_WEBHOOK) {
		throw new Error('Missing DISCORD_WEBHOOK in environment');
	}
	return env.DISCORD_WEBHOOK;
}
