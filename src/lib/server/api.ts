import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { redis } from '$lib/server/redis';

export async function bffFetch<T = unknown>(
	event: import('@sveltejs/kit').RequestEvent,
	path: string,
	options: RequestInit = {}
): Promise<T> {
	const { locals, fetch, cookies } = event;

	const lockKey = `lock:refresh:${locals.user?.sessionid}`;
	const sessionKey = `session:${locals.user?.sessionid}`;

	// Helper để thực hiện request
	const doFetch = async (token: string | undefined) => {
		const headers = new Headers(options.headers);
		if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
		if (token) headers.set('Authorization', `Bearer ${token}`);

		return await fetch(`${env.GO_BACKEND_URL}${path}`, {
			...options,
			headers
		});
	};

	let response = await doFetch(locals.user?.accessToken);

	// 3. Xử lý Refresh Token tập trung
	if (response.status === 401 && locals.user?.refreshToken) {
		const acquiredLock = await redis.set(lockKey, 'locked', 'EX', 10, 'NX');

		if (acquiredLock === 'OK') {
			try {
				// TÔI LÀ NGƯỜI REFRESH
				const refreshRes = await fetch(`${env.GO_BACKEND_URL}/auth/refresh`, {
					method: 'POST',
					body: JSON.stringify({ refresh_token: locals.user.refreshToken })
				});

				if (refreshRes.ok) {
					const newTokens = await refreshRes.json();
					const updatedUser = { ...locals.user, ...newTokens };
					// Lưu vào Redis cho tất cả các Tab khác thấy
					await redis.set(sessionKey, JSON.stringify(updatedUser), 'EX', 60 * 60 * 24);
					locals.user = updatedUser;
					response = await doFetch(newTokens.access_token);
				} else {
					// Refresh fail -> Xóa session luôn
					await redis.del(sessionKey);
					cookies.delete('session_id', { path: '/' });
					throw error(401, 'Phiên làm việc hết hạn');
				}
			} finally {
				// Xóa lock sau khi làm xong
				await redis.del(lockKey);
			}
		} else {
			// TÔI LÀ NGƯỜI ĐỢI (Các Tab khác)
			// Đợi tối đa 5 giây, mỗi 500ms kiểm tra Redis một lần xem có Token mới chưa
			let retryCount = 0;
			let success = false;
			while (retryCount < 5) {
				// Đợi tối đa 5s
				await new Promise((r) => setTimeout(r, 500));
				const freshData = await redis.get(sessionKey);
				if (freshData) {
					const newUser = JSON.parse(freshData);
					if (newUser.access_token !== locals.user.accessToken) {
						locals.user = newUser;
						response = await doFetch(newUser.access_token);
						success = true;
						break;
					}
				}
				retryCount++;
			}
			if (!success && response.status === 401) {
				throw error(401, 'Hệ thống bận, vui lòng thử lại');
			}
		}
	}

	// 4. Parse Body một lần duy nhất
	const isJson = response.headers.get('content-type')?.includes('application/json');
	const result = isJson ? await response.json() : await response.text();

	if (!response.ok) {
		throw error(response.status, {
			message: isJson ? result.message || result.error : result,
			code: result?.code || 'BFF_ERROR'
		});
	}

	return result as T;
}
