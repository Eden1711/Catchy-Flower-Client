import { browser } from '$app/environment';
import { derived, writable, type Writable } from 'svelte/store';

export interface CartItem {
	id: number | string;
	name: string;
	price: number;
	qty: number;
}

const createCart = () => {
	const initial = browser ? JSON.parse(localStorage.getItem('cart') || '[]') : [];
	const { subscribe, set, update }: Writable<CartItem[]> = writable(initial);

	// mỗi khi cart thay đổi -> lưu lại localStorage
	// localStorage chỉ tồn tại trên browser
	// Khi chạy SSR , code chạy trên Node.js → ở đó không có localStorage
	if (browser) {
		subscribe((value) => {
			localStorage.setItem('cart', JSON.stringify(value));
		});
	}
	return {
		subscribe,

		add: (item: Omit<CartItem, 'qty'>) =>
			update((cart) => {
				const existing = cart.find((p) => p.id === item.id);
				if (existing) {
					return cart.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
				}
				return [...cart, { ...item, qty: 1 }];
			}),

		decrease: (id: CartItem['id']) =>
			update((cart) => cart.map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p))),

		remove: (id: CartItem['id']) => update((cart) => cart.filter((p) => p.id !== id)),

		clear: () => set([])
	};
};

export const cart = createCart();

// derived stores
export const totalItems = derived(cart, ($cart) => $cart.reduce((sum, item) => sum + item.qty, 0));

export const totalPrice = derived(cart, ($cart) =>
	$cart.reduce((sum, item) => sum + item.qty * item.price, 0)
);
