// src/routes/api/contact/+server.js
import { json } from '@sveltejs/kit';
import { getRedis } from '$lib/server/redis';
import { env } from '$env/dynamic/private';

export async function POST({ request, getClientAddress }) {
	try {
		const { name, email, message } = await request.json();
		const ip = getClientAddress();

		const redis = getRedis(); // lazy init
		const key = `contact:${ip}`;
		const count = await redis.incr(key);

		if (count === 1) {
			// set expiry only first time
			await redis.expire(key, 600); // 600s = 10min
		}

		if (count > 5) {
			return json(
				{ success: false, error: 'Rate limit exceeded. Try again later.' },
				{ status: 429 }
			);
		}

		const payload = {
			username: 'DiasporaJunxion Contact Form',
			embeds: [
				{
					title: '📩 New Contact Form Submission',
					color: 0x008e30,
					fields: [
						{ name: 'Name', value: name, inline: false },
						{ name: 'Email', value: email, inline: false },
						{ name: 'Message', value: message, inline: false }
					],
					timestamp: new Date().toISOString()
				}
			]
		};

		const res = await fetch(env.DISCORD_WEBHOOK, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			return json({ success: false, error: 'Failed to send to Discord' }, { status: 500 });
		}

		return json({ success: true });
	} catch (err) {
		console.error('Contact API error:', err);
		return json({ success: false, error: 'Server error' }, { status: 500 });
	}
}
