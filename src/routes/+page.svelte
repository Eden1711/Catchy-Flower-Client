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

<div class="h-[1200px] w-full pt-16">
	<section id="home" class="page-section active">
		<div class="group relative -mx-4 mb-12 h-[400px] overflow-hidden shadow-xl md:h-[500px]">
			<img
				src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=2000"
				class="h-full w-full object-cover brightness-[0.85] transition duration-1000 group-hover:scale-105"
				alt="Hero"
			/>
			<div
				class="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white"
			>
				<span
					class="mb-4 animate-bounce rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white"
					>Mới nhất 2024</span
				>
				<h1 class="mb-4 text-4xl leading-tight font-bold drop-shadow-lg md:text-7xl">
					Mùa Yêu Thương
				</h1>
				<button
					class="mt-4 rounded-full bg-white px-8 py-3 font-bold text-rose-900 shadow-lg transition hover:bg-rose-50"
				>
					Mua Ngay
				</button>
			</div>
		</div>
	</section>
</div>
