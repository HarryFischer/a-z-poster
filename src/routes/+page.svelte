<script lang="ts">
	import { getPreviewUrl } from '$lib/posters.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	function formatPrice(pence: number, currency: string): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: currency.toUpperCase(),
			minimumFractionDigits: 0
		}).format(pence / 100);
	}
</script>

<svelte:head>
	<title>Letterform — Typographic Poster Shop</title>
</svelte:head>

<div class="page">
	<header class="hero">
		<h1>Typographic posters, <em>made to order.</em></h1>
		<p>Choose your design, pick your letter — printed and shipped to your door.</p>
	</header>

	<section class="grid">
		{#each data.designs as design}
			<article class="card">
				<a href="/design/{design.id}" class="card-image-link">
					<div class="card-image">
						<img
							src={getPreviewUrl(design.id, design.previewLetter)}
							alt="{design.name} — Letter A preview"
							loading="lazy"
						/>
					</div>
				</a>
				<div class="card-body">
					<div class="card-meta">
						<span class="label">{design.paperSize}</span>
						<span class="label">{design.technique}</span>
					</div>
					<h2 class="card-name">{design.name}</h2>
					<div class="card-footer">
						<span class="price">{formatPrice(design.price, design.currency)}</span>
						<a href="/design/{design.id}" class="btn-personalise">Personalise</a>
					</div>
				</div>
			</article>
		{/each}
	</section>
</div>

<style>
	.page {
		max-width: 1100px;
		margin: 0 auto;
		padding: 48px 24px 80px;
	}

	.hero {
		margin-bottom: 48px;
	}

	.hero h1 {
		font-size: clamp(28px, 4vw, 44px);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin-bottom: 12px;
	}

	.hero h1 em {
		font-style: italic;
		font-weight: 400;
	}

	.hero p {
		font-size: 16px;
		color: var(--text-secondary);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
	}

	.card {
		border: 0.5px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--bg);
		transition: border-color 0.15s;
	}

	.card:hover {
		border-color: rgba(0, 0, 0, 0.25);
	}

	.card-image-link {
		display: block;
	}

	.card-image {
		aspect-ratio: 3 / 4;
		background: var(--bg-tertiary);
		overflow: hidden;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.card-body {
		padding: 16px;
	}

	.card-meta {
		display: flex;
		gap: 6px;
		margin-bottom: 8px;
	}

	.label {
		font-size: 11px;
		color: var(--text-secondary);
		background: var(--bg-secondary);
		border: 0.5px solid var(--border);
		border-radius: 4px;
		padding: 2px 8px;
		letter-spacing: 0.04em;
	}

	.card-name {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 14px;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.price {
		font-size: 18px;
		font-weight: 600;
	}

	.btn-personalise {
		padding: 8px 16px;
		border: 0.5px solid var(--border-active);
		border-radius: var(--radius);
		font-size: 13px;
		font-weight: 500;
		background: transparent;
		color: var(--text);
		transition: background 0.15s, color 0.15s;
	}

	.btn-personalise:hover {
		background: var(--text);
		color: var(--bg);
	}
</style>
