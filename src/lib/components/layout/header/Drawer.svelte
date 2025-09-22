<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	export let open: boolean;
	export let onClose: () => void;

	function handleNavigate(path: string) {
		onClose();
		goto(path, { noScroll: false });
	}
</script>

{#if open}
	<button
		aria-label="Close menu"
		class="bg-opacity-40 fixed inset-0 z-10 bg-transparent"
		on:click={() => onClose()}
	></button>
	<!-- Drawer -->
	<aside
		transition:fly={{ x: -300, duration: 400 }}
		class="fixed top-0 left-0 z-20 h-full w-64 bg-white shadow-lg"
	>
		<div class="flex items-center justify-between border-b p-4">
			<span class="font-bold">Menu</span>
			<button on:click={() => onClose()} aria-label="Close menu">✕</button>
		</div>
		<ul class="p-4">
			<li class="py-2">
				<button class="w-full text-left" on:click={() => handleNavigate('/')}>Trang chủ</button>
			</li>
			<li class="py-2">
				<button class="w-full text-left" on:click={() => handleNavigate('/about')}
					>Giới thiệu</button
				>
			</li>
		</ul>
	</aside>
{/if}
