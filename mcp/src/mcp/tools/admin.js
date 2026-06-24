export function adminTools({ convex }) {
	return [
		readTool('get_admin_dashboard_summary', 'Get grouped admin dashboard metrics.', convex),
		readTool('get_needs_attention', 'Get applications, payments, and listings that need attention.', convex),
		readTool('get_directory_health_summary', 'Get active, verified, featured, and category health metrics.', convex),
		readTool('get_payment_summary', 'Get payment counts and revenue-oriented payment status summary.', convex),
		readTool('get_recent_activity', 'Get recent admin/support activity events.', convex, {
			limit: { type: 'number', minimum: 1, maximum: 100 }
		})
	];
}

function readTool(name, description, convex, properties = {}) {
	return {
		name,
		description,
		inputSchema: { type: 'object', additionalProperties: false, properties },
		handler: async (input = {}) => await convex.queryForTool(name, input)
	};
}
