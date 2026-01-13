import type { Handle, HandleServerError } from '@sveltejs/kit';
import { redis } from '$lib/server/redis';
import { logger } from '$lib/server/logger';

export const handle: Handle = async ({ event, resolve }) => {
	const sid = event.cookies.get('session_id');
	if (sid) {
		const data = await redis.get(`session:${sid}`);

		if (data) event.locals.user = { ...JSON.parse(data), sid };
	}
	const publicPaths = ['/login', '/register', '/about', '/contact', '/'];
	const isPublic = publicPaths.includes(event.url.pathname);
	const start = Date.now();

	if (isPublic) {
		return await resolve(event);
	}

	const response = await resolve(event);

	const duration = Date.now() - start;

	const ignoredPaths = ['/.well-known', '/favicon.ico'];
	const isIgnored = ignoredPaths.some((path) => event.url.pathname.startsWith(path));
	const isApi = event.url.pathname.startsWith('/api');
	const isError = response.status >= 400;

	if ((isApi || isError) && !isIgnored) {
		logger.info('Incoming Request', {
			method: event.request.method,
			url: event.url.pathname,
			status: response.status,
			duration: `${duration}ms`,
			user: event.locals.user?.sessionid || 'guest',
			ip: event.getClientAddress()
		});
	}

	// Security Headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return response;
};

export const handleError: HandleServerError = ({ error, event }) => {
	const err = error as App.Error;

	if (err?.status === 404) {
		return {
			message: 'Trang bạn tìm kiếm không tồn tại.',
			code: 'NOT_FOUND'
		};
	}

	console.error(`[BFF_CRASH] URL: ${event.url.pathname} | Error:`, error);

	return {
		message: err?.message || 'Đã có lỗi xảy ra!',
		code: err?.code || 'INTERNAL_SERVER_ERROR'
	};
};
