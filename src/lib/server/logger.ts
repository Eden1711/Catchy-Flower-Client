// src/lib/server/logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
	info: (message: string, data?: object) => {
		console.log(
			JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message, ...data })
		);
	},
	error: (message: string, error?: unknown, data?: object) => {
		let errorMsg: string;
		let errorStack: string | undefined;

		switch (true) {
			case error instanceof Error: {
				const err = error as Error;
				errorMsg = err.message;
				errorStack = err.stack;
				break;
			}
			case typeof error === 'string': {
				errorMsg = error as string;
				break;
			}
			case typeof error === 'object' && error !== null: {
				errorMsg = JSON.stringify(error);
				break;
			}
			default: {
				errorMsg = 'Unknown error';
				break;
			}
		}

		console.error(
			JSON.stringify({
				level: 'ERROR',
				timestamp: new Date().toISOString(),
				message,
				error: errorMsg,
				stack: isDev ? errorStack : undefined,
				...data
			})
		);
	}
};
