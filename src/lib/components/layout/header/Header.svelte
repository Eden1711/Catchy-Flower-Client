<script lang="ts">
	import CartIcon from '$lib/components/icons/CartIcon.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import { totalItems } from '$lib/store/cart';
	import CartDrawer from './CartDrawer.svelte';
	import Drawer from './Drawer.svelte';

	let open = $state(false);
	let openCart = $state(false);
	let showHeader = $state(true);
	let lastScrollY = $state(0);

	$effect(() => {
		const handleScroll = () => {
			const currentY = window.scrollY;
			console.log(currentY);

			showHeader = currentY < lastScrollY;
			lastScrollY = currentY;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="header fixed top-0 left-0 z-10 h-auto w-full bg-white p-4"
	style:transform={showHeader ? 'translateY(0)' : 'translateY(-100%)'}
	style:transition="transform 0.2s ease-in-out"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<button aria-label="Open menu" onclick={() => (open = true)} class="p-2 lg:hidden">
			<MenuIcon />
		</button>
		<h1 class="">Catchy Flower</h1>
		<div class="hidden flex-1 items-center justify-center space-x-8 text-gray-600 md:flex">
			<a href="/" class="text-sm font-medium tracking-wide uppercase hover:text-rose-500"
				>Trang chủ</a
			>
			<a
				href="/"
				class="flex cursor-pointer items-center py-2 text-sm font-medium tracking-wide uppercase hover:text-rose-500"
			>
				Danh mục
			</a>
			<a href="/" class="text-sm font-medium tracking-wide uppercase hover:text-rose-500"
				>Sản phẩm</a
			>
		</div>

		<div class="flex items-center justify-end md:space-x-5">
			<button class="relative hidden transition hover:text-rose-500 md:block" aria-label="Search">
				<SearchIcon />
			</button>
			<button
				onclick={() => (openCart = true)}
				class="group relative p-1 transition hover:text-rose-500"
				aria-label="Open card"
			>
				<CartIcon />
				<span
					class="absolute -top-0 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white md:-top-1 md:-right-2"
					>{$totalItems}</span
				>
			</button>
			<button class="hidden hover:text-rose-500 md:block" aria-label="User">
				<UserIcon />
			</button>
		</div>
	</div>
</header>

<Drawer {open} onClose={() => (open = false)} />
<CartDrawer {openCart} onClose={() => (openCart = false)} />
