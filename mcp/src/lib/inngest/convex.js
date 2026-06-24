import { convexMutation, convexQuery, withAuth } from '$lib/server/convex.js';

export function workflowAuth() {
	return {
		role: 'ADMIN',
		adminToken: process.env.DIASPORAJUNXION_ADMIN_TOKEN || process.env.ADMIN_ACTION_TOKEN
	};
}

export async function workflowQuery(functionName, args = {}) {
	return await convexQuery(functionName, withAuth(args, workflowAuth()));
}

export async function workflowMutation(functionName, args = {}) {
	return await convexMutation(functionName, withAuth(args, workflowAuth()));
}
