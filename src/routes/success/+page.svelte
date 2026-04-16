<script lang="ts">
	import { page } from "$app/state";
	import { getPreviewUrl } from "$lib/posters.js";
	import { clearItem } from "$lib/stores/cartStore.js";
	import { onMount } from "svelte";

	const letter = $derived(page.url.searchParams.get("letter") ?? "A");
	const designId = $derived(page.url.searchParams.get("design") ?? "design-01");
	const previewUrl = $derived(getPreviewUrl(designId, letter));

	onMount(() => {
		clearItem();
	});
</script>

<svelte:head>
	<title>Order confirmed — Letterform</title>
</svelte:head>

<div class="page">
	<div class="content">
		<div class="poster-wrap">
			<img src={previewUrl} alt="Letter {letter}" class="poster-img" />
		</div>

		<div class="message">
			<p class="eyebrow">Order confirmed</p>
			<h1>Your poster is on its way.</h1>
			<p class="body-text">
				You'll receive an email confirmation shortly. Your poster will be
				printed and shipped within 3–5 working days.
			</p>
			<a href="/" class="btn-home">Back to shop</a>
		</div>
	</div>
</div>

<style>
	.page {
		min-height: calc(100vh - 48px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		background: var(--bg-secondary);
	}

	.content {
		display: flex;
		gap: 60px;
		align-items: center;
		max-width: 780px;
		width: 100%;
	}

	.poster-wrap {
		flex-shrink: 0;
		width: 180px;
	}

	.poster-img {
		width: 100%;
		aspect-ratio: 1 / 1.414;
		object-fit: cover;
		display: block;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
		background: var(--bg);
	}

	.message {
		flex: 1;
	}

	.eyebrow {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-secondary);
		margin-bottom: 12px;
	}

	h1 {
		font-size: clamp(26px, 3.5vw, 40px);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin-bottom: 16px;
	}

	.body-text {
		font-size: 15px;
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 420px;
		margin-bottom: 28px;
	}

	.btn-home {
		display: inline-block;
		padding: 10px 22px;
		border: 0.5px solid var(--border-active);
		border-radius: var(--radius);
		font-size: 14px;
		font-weight: 500;
		color: var(--text);
		transition:
			background 0.15s,
			color 0.15s;
	}

	.btn-home:hover {
		background: var(--text);
		color: var(--bg);
	}

	@media (max-width: 600px) {
		.content {
			flex-direction: column;
			gap: 32px;
			align-items: flex-start;
		}

		.poster-wrap {
			width: 120px;
		}
	}
</style>
