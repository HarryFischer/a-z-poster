<script lang="ts">
	import { goto } from "$app/navigation";
	import { getPreviewUrl } from "$lib/posters.js";
	import { setItem } from "$lib/stores/cartStore.js";
	import type { PageData } from "./$types.js";

	let { data }: { data: PageData } = $props();

	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	let selectedLetter = $state("A");

	function selectLetter(l: string) {
		selectedLetter = l;
	}

	function addToBasket() {
		setItem(data.design, selectedLetter);
		goto("/checkout");
	}

	function formatPrice(pence: number, currency: string): string {
		return new Intl.NumberFormat("en-GB", {
			style: "currency",
			currency: currency.toUpperCase(),
			minimumFractionDigits: 0,
		}).format(pence / 100);
	}

	let previewUrl = $derived(getPreviewUrl(data.design.id, selectedLetter));
</script>

<svelte:head>
	<title>{data.design.name} — Letterform</title>
</svelte:head>

<div class="page">
	<!-- Left: poster preview -->
	<div class="preview-area">
		<div class="preview-wrap">
			<img
				src={previewUrl}
				alt="{data.design.name} — Letter {selectedLetter}"
				class="preview-image"
			/>
		</div>
	</div>

	<!-- Right: control panel -->
	<div class="panel">
		<div class="panel-inner">
			<!-- YOUR LETTER -->
			<section>
				<div class="section-label">Your letter</div>
				<div class="letter-grid">
					{#each letters as l}
						<button
							class="letter-btn"
							class:active={selectedLetter === l}
							onclick={() => selectLetter(l)}
						>
							{l}
						</button>
					{/each}
				</div>
			</section>

			<hr class="divider" />

			<!-- ABOUT THIS DESIGN -->
			<section>
				<div class="section-label">About this design</div>
				<h1 class="design-name">{data.design.name}</h1>
				<p class="design-desc">{data.design.description}</p>
			</section>

			<hr class="divider" />

			<!-- PAPER SIZE -->
			<section>
				<div class="section-label">Paper size</div>
				<div class="info-row">
					<span class="info-value">{data.design.paperSize}</span>
				</div>
			</section>

			<hr class="divider" />

			<!-- PRINTING TECHNIQUE -->
			<section>
				<div class="section-label">Printing technique</div>
				<div class="info-row">
					<span class="info-value">{data.design.technique}</span>
				</div>
			</section>
		</div>

		<!-- Sticky footer -->
		<div class="panel-footer">
			<div class="price-row">
				<span class="price-label">Total</span>
				<span class="price-val"
					>{formatPrice(data.design.price, data.design.currency)}</span
				>
			</div>
			<button class="btn-basket" onclick={addToBasket}>
				Add to basket — Letter {selectedLetter}
			</button>
		</div>
	</div>
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: 1fr 360px;
		height: calc(100vh - 48px);
		overflow: hidden;
	}

	/* Preview */
	.preview-area {
		background: var(--bg-tertiary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px;
		overflow: hidden;
	}

	.preview-wrap {
		max-width: 360px;
		width: 100%;
	}

	.preview-image {
		width: 100%;
		aspect-ratio: 1 / 1.414;
		object-fit: cover;
		display: block;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
		background: var(--bg);
	}

	/* Panel */
	.panel {
		background: var(--bg);
		border-left: 0.5px solid var(--border);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.panel-inner {
		flex: 1;
		overflow-y: auto;
		padding: 20px 18px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.section-label {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-secondary);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 12px;
	}

	.divider {
		border: none;
		border-top: 0.5px solid var(--border);
	}

	/* Letter grid */
	.letter-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 5px;
	}

	.letter-btn {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: 500;
		background: transparent;
		border: 0.5px solid var(--border);
		border-radius: var(--radius);
		transition:
			border-color 0.12s,
			background 0.12s;
	}

	.letter-btn:hover {
		background: var(--bg-secondary);
	}

	.letter-btn.active {
		border: 1.5px solid var(--text);
		background: var(--bg-secondary);
	}

	/* Design info */
	.design-name {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.design-desc {
		font-size: 13px;
		color: var(--text-secondary);
		line-height: 1.55;
	}

	/* Info rows */
	.info-row {
		display: flex;
		align-items: center;
	}

	.info-value {
		font-size: 14px;
		font-weight: 500;
	}

	/* Footer */
	.panel-footer {
		padding: 14px 18px;
		border-top: 0.5px solid var(--border);
		background: var(--bg);
		flex-shrink: 0;
	}

	.price-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 10px;
	}

	.price-label {
		font-size: 13px;
		color: var(--text-secondary);
	}

	.price-val {
		font-size: 20px;
		font-weight: 600;
	}

	.btn-basket {
		width: 100%;
		padding: 12px;
		background: var(--text);
		color: var(--bg);
		border: none;
		border-radius: var(--radius);
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.03em;
		transition: opacity 0.15s;
	}

	.btn-basket:hover {
		opacity: 0.82;
	}

	@media (max-width: 700px) {
		.page {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
			height: auto;
			overflow: visible;
		}

		.preview-area {
			height: 60vw;
			min-height: 280px;
		}

		.panel {
			border-left: none;
			border-top: 0.5px solid var(--border);
		}

		.panel-inner {
			overflow-y: visible;
		}
	}
</style>
