<script lang="ts">
	import { cart } from '$lib/store/cart';
	const addFlower = () => {
		cart.add({
			id: 'flower1',
			name: 'Beautiful Flower',
			price: 29
		});
	};
</script>

<div class="w-full pt-16">
	<div class="-mx-4">
		<img src="/src/lib/assets/banner.avif" alt="Flower banner" class="h-full w-full object-cover" />
		<div class="grid place-items-center gap-4 p-7">
			<h1 class="text-3xl font-bold">Chào Mùa Thu ️🍂</h1>
			<p class="text-center text-lg">Bắt đầu mùa thu rực rỡ với những đóa hoa này</p>
			<button
				on:click={addFlower}
				class="rounded bg-[#085b45] px-4 py-3 text-base text-white transition"
			>
				Mua Ngay
			</button>
		</div>
		<div class="bg-[#333333] text-white">
			<p class="px-3 py-2 text-center text-sm leading-6">
				Có điều gì đó đặc biệt đang chờ đón... khám phá những bó hoa độc đáo của chúng tôi! Mua Ngay
			</p>
		</div>
	</div>
</div>
