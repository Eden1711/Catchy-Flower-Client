<script>
	import { page } from '$app/state';
</script>

<div style="text-align: center; padding: 100px;">
	<h1>Ối! {page.status} rồi.</h1>
	<p>{page.error?.message}</p>
	<a href="/">Quay về trang chủ</a>
</div>
