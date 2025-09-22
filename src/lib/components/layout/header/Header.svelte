<script lang="ts">
	import CartIcon from '$lib/components/icons/CartIcon.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import { onMount } from 'svelte';
	import Drawer from './Drawer.svelte';
	import CartDrawer from './CartDrawer.svelte';
	import { totalItems } from '$lib/store/cart';

	let open = false;
	let openCart = false;
	let showHeader = true;
	let lastScrollY = 0;

	onMount(() => {
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
	<button aria-label="Open menu" on:click={() => (open = true)} class="p-2">
		<MenuIcon />
	</button>
	<h1 class="">Catchy Flower</h1>
	<button aria-label="Open card" on:click={() => (openCart = true)} class="relative p-2">
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
