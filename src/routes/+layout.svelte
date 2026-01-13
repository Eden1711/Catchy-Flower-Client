<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Header } from '$lib/components/layout/header';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class=" mx-auto min-h-screen px-4 py-2">
	<Header />
	{@render children?.()}
</div>
