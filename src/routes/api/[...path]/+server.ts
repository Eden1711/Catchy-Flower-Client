import { bffFetch } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const fallback: RequestHandler = async (event) => {
	const { params, request } = event;

	// 1. Lấy đường dẫn thực tế sau tiền tố /api/
	// Ví dụ: /api/v1/flowers -> path = "v1/flowers"
	const path = `/${params.path}`;

	// 2. Lấy query string (nếu có) ví dụ: ?page=1&limit=10
	const search = new URL(request.url).search;
	const fullPath = `${path}${search}`;

	// 3. Chuyển tiếp request sang Go Backend thông qua bffFetch
	// bffFetch đã có sẵn logic: Gắn Token, Auto-Refresh, Logging
	try {
		const method = request.method;
		const options: RequestInit = { method };

		// Nếu không phải GET/HEAD, ta cần chuyển tiếp Body
		if (method !== 'GET' && method !== 'HEAD') {
			options.body = await request.blob();
		}

		const data = await bffFetch(event, fullPath, options);

		// 4. Trả kết quả về cho Client
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		// Sửa lỗi any bằng cách ép kiểu sang App.Error hoặc object cụ thể
		const error = err as App.Error;

		return new Response(
			JSON.stringify({
				message: error.message || 'Proxy Error',
				code: error.code || 'PROXY_ERROR'
			}),
			{
				status: error.status || 500
			}
		);
	}
};
