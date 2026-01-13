<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cart, totalPrice } from '$lib/store/cart';
	export let openCart: boolean;
	export let onClose: () => void;
</script>

{#if openCart}
	<button
		aria-label="Close card"
		class="bg-opacity-40 fixed inset-0 z-10 bg-transparent"
		on:click={() => onClose()}
	></button>
	<!-- Drawer -->
	<aside
		transition:fly={{ x: 300, duration: 400 }}
		class="fixed top-0 right-0 z-20 flex h-full w-full flex-col bg-white shadow-lg sm:w-[400px]"
	>
		<div class="flex items-center justify-between border-b p-4">
			<span class="font-bold">Cart</span>
			<button on:click={() => onClose()} aria-label="Close card">✕</button>
		</div>

		<ul class="flex-1 p-4">
			{#each $cart as item}
				<li class="flex justify-between py-2">
					<span>{item.name} x {item.qty}</span>
					<span>${(item.price * item.qty).toFixed(2)}</span>
					<button disabled={item.qty === 1} on:click={() => cart.decrease(item.id)}>-</button>
					<button
						on:click={() =>
							cart.add({
								id: item.id,
								name: item.name,
								price: item.price
							})}>+</button
					>
					<button class="ml-2 text-red-500" on:click={() => cart.remove(item.id)}>✕</button>
				</li>
			{/each}
		</ul>
		<div class="mt-2 flex justify-between border-t p-2 pt-2 font-bold">
			<span>Total</span>
			<span>{$totalPrice}</span>
		</div>
	</aside>
{/if}
