import { ConvexHttpClient } from 'convex/browser';
import { makeFunctionReference } from 'convex/server';

export function createServerConvexClient(env = process.env) {
	if (!env.CONVEX_URL) throw new Error('CONVEX_URL is required.');
	const client = new ConvexHttpClient(env.CONVEX_URL);
	if (env.CONVEX_ADMIN_KEY && typeof client.setAdminAuth === 'function') {
		client.setAdminAuth(env.CONVEX_ADMIN_KEY);
	}
	return client;
}

export async function convexQuery(functionName, args = {}, env = process.env) {
	return await createServerConvexClient(env).query(makeFunctionReference(functionName), args);
}

export async function convexMutation(functionName, args = {}, env = process.env) {
	return await createServerConvexClient(env).mutation(makeFunctionReference(functionName), args);
}

export function withAuth(args = {}, auth) {
	return auth && Object.keys(auth).length ? { ...args, auth } : args;
}

export function withWebhookContext(args = {}, webhook) {
	return webhook && Object.keys(webhook).length ? { ...args, webhook } : args;
}
