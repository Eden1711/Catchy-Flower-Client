<script lang="ts">
	import CartIcon from '$lib/components/icons/CartIcon.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
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
			showHeader = currentY < lastScrollY;
			lastScrollY = currentY;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="header fixed top-0 left-0 z-10 flex h-16 w-full items-center justify-between bg-white px-4"
	style:transform={showHeader ? 'translateY(0)' : 'translateY(-100%)'}
	style:transition="transform 0.2s ease-in-out"
>
	<button aria-label="Open menu" onclick={() => (open = true)} class="p-2">
		<MenuIcon />
	</button>
	<h1 class="">Catchy Flower</h1>
	<button aria-label="Open card" onclick={() => (openCart = true)} class="relative p-2">
		<CartIcon />
		<div
			class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
		>
			{$totalItems}
		</div>
	</button>
</header>

<Drawer {open} onClose={() => (open = false)} />
<CartDrawer {openCart} onClose={() => (openCart = false)} />
