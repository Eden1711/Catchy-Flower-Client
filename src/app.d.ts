// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				accessToken: string; // Access Token
				refreshToken: string; // Refresh Token
				sessionid: string; // Session ID
				user: {
					username: string;
				};
			} | null;
		}
		interface Error {
			message: string;
			code?: string;
			status?: number;
		}
		interface PageData {
			userProfile: {
				username: string;
			};
			user: {
				username: string;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
