<script lang="ts">
	import { posterStore } from '$lib/stores/posterStore';
	import FontPicker from './FontPicker.svelte';
	import ColourPicker from './ColourPicker.svelte';
	import SizePicker from './SizePicker.svelte';
	import TechniquePicker from './TechniquePicker.svelte';
	import LayoutPicker from './LayoutPicker.svelte';
	import type { LayoutOption, PosterState } from '$lib/types/poster';

	let { posterState, totalPrice, isReadyToOrder }: {
		posterState: PosterState;
		totalPrice: number;
		isReadyToOrder: boolean;
	} = $props();

	let generatedLayouts: LayoutOption[] = $state([]);
	let loading = $state(false);
	let loadingStage = $state(0);
	let basketConfirm = $state(false);
	let hasGenerated = $state(false);

	const loadingMessages = [
		'Analysing brand references…',
		'Reading composition patterns…',
		'Generating layout options…'
	];

	let loadingInterval: ReturnType<typeof setInterval> | null = null;

	async function generateLayouts() {
		loading = true;
		loadingStage = 0;

		loadingInterval = setInterval(() => {
			loadingStage = (loadingStage + 1) % loadingMessages.length;
		}, 900);

		try {
			const res = await fetch('/api/generate-layouts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					letter: posterState.letter,
					word: posterState.word,
					font: posterState.font,
					bg: posterState.bg,
					fg: posterState.fg
				})
			});

			if (!res.ok) throw new Error(await res.text());

			const layouts: LayoutOption[] = await res.json();
			generatedLayouts = layouts;
			hasGenerated = true;

			posterStore.update((s) => ({
				...s,
				activeLayout: layouts[0],
				generated: true
			}));
		} catch (err) {
			console.error('Failed to generate layouts:', err);
		} finally {
			loading = false;
			if (loadingInterval) {
				clearInterval(loadingInterval);
				loadingInterval = null;
			}
		}
	}

	function addToBasket() {
		basketConfirm = true;
		setTimeout(() => {
			basketConfirm = false;
		}, 3000);
	}

	function handleLetterInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		posterStore.update((s) => ({ ...s, letter: val.slice(-1) || 'A' }));
	}

	function handleWordInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		posterStore.update((s) => ({ ...s, word: val }));
	}
</script>

<div class="panel">
	<div class="panel-inner">
		<!-- Your text -->
		<section>
			<div class="section-label">Your text</div>
			<div class="letter-inputs">
				<div class="input-group">
					<label for="letter-in">Letter</label>
					<input
						id="letter-in"
						class="letter-input"
						maxlength="1"
						value={posterState.letter}
						oninput={handleLetterInput}
					/>
				</div>
				<div class="input-group">
					<label for="word-in">Word</label>
					<input
						id="word-in"
						class="word-input"
						maxlength="20"
						value={posterState.word}
						oninput={handleWordInput}
					/>
				</div>
			</div>
		</section>

		<hr class="divider" />

		<!-- Layout -->
		<section>
			<div class="section-label">Layout</div>
			<p class="info-note">
				Using brand reference set — 12 curated posters inform every AI layout suggestion
			</p>

			{#if generatedLayouts.length > 0}
				<div class="layout-picker-wrap">
					<LayoutPicker layouts={generatedLayouts} {posterState} />
				</div>
				{#if hasGenerated}
					<p class="regen-hint">Not quite right? Regenerate for 3 new options.</p>
				{/if}
			{/if}

			<button
				class="ai-btn"
				class:loading
				disabled={loading}
				onclick={generateLayouts}
			>
				<span class="ai-sparkle">✦</span>
				<span>
					{#if loading}
						{loadingMessages[loadingStage]}
					{:else if hasGenerated}
						Regenerate 3 layout options
					{:else}
						Generate 3 layout options
					{/if}
				</span>
			</button>
		</section>

		<hr class="divider" />

		<!-- Font -->
		<section>
			<div class="section-label">Font</div>
			<FontPicker activeFont={posterState.font} fg={posterState.fg} />
		</section>

		<hr class="divider" />

		<!-- Colours -->
		<section>
			<div class="section-label">Colours</div>
			<ColourPicker bg={posterState.bg} fg={posterState.fg} />
		</section>

		<hr class="divider" />

		<!-- Paper size -->
		<section>
			<div class="section-label">Paper size</div>
			<SizePicker activeSize={posterState.paperSize} fg={posterState.fg} />
		</section>

		<hr class="divider" />

		<!-- Printing technique -->
		<section>
			<div class="section-label">Printing technique</div>
			<TechniquePicker activeTechnique={posterState.technique} fg={posterState.fg} />
		</section>
	</div>

	<!-- Basket footer -->
	<div class="basket-footer">
		<div class="price-row">
			<span class="price-label">Total</span>
			<span class="price-val">£{totalPrice}</span>
		</div>
		{#if basketConfirm}
			<div class="basket-confirm">
				<p>Added to basket</p>
				<small>Your poster is saved — proceed to checkout when ready</small>
			</div>
		{:else}
			<button
				class="basket-btn"
				disabled={!isReadyToOrder}
				onclick={addToBasket}
			>
				{isReadyToOrder ? 'Add to basket' : 'Generate a layout first'}
			</button>
		{/if}
	</div>
</div>

<style>
	.panel {
		background: #fff;
		border-left: 0.5px solid rgba(0, 0, 0, 0.12);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	.panel-inner {
		padding: 18px 16px;
		display: flex;
		flex-direction: column;
		gap: 18px;
		flex: 1;
		overflow-y: auto;
	}

	.section-label {
		font-size: 11px;
		font-weight: 600;
		color: #6b6b6b;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 10px;
		font-family: system-ui, sans-serif;
	}

	.divider {
		border: none;
		border-top: 0.5px solid rgba(0, 0, 0, 0.12);
		margin: 0;
	}

	.letter-inputs {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 8px;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.input-group label {
		font-size: 12px;
		color: #6b6b6b;
		font-family: system-ui, sans-serif;
	}

	.letter-input {
		width: 100%;
		text-align: center;
		font-size: 22px;
		font-weight: 600;
		text-transform: uppercase;
		padding: 8px;
		border: 0.5px solid rgba(0, 0, 0, 0.22);
		border-radius: 8px;
		background: #fff;
		color: #1a1a1a;
		outline: none;
		font-family: system-ui, sans-serif;
	}

	.word-input {
		width: 100%;
		font-size: 14px;
		padding: 9px 10px;
		border: 0.5px solid rgba(0, 0, 0, 0.22);
		border-radius: 8px;
		background: #fff;
		color: #1a1a1a;
		letter-spacing: 0.05em;
		outline: none;
		font-family: system-ui, sans-serif;
	}

	.letter-input:focus,
	.word-input:focus {
		border-color: #1a1a1a;
	}

	.info-note {
		font-size: 11px;
		color: #6b6b6b;
		line-height: 1.5;
		margin-bottom: 10px;
		font-family: system-ui, sans-serif;
		opacity: 0.8;
	}

	.layout-picker-wrap {
		margin-bottom: 10px;
	}

	.regen-hint {
		font-size: 11px;
		color: #6b6b6b;
		margin-bottom: 8px;
		font-family: system-ui, sans-serif;
		opacity: 0.75;
	}

	.ai-btn {
		width: 100%;
		padding: 10px;
		border: 0.5px dashed rgba(0, 0, 0, 0.22);
		border-radius: 8px;
		background: transparent;
		color: #1a1a1a;
		font-size: 13px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: background 0.15s, border-color 0.15s;
		font-family: system-ui, sans-serif;
	}

	.ai-btn:hover:not(:disabled) {
		background: #f7f7f5;
		border-color: #1a1a1a;
	}

	.ai-btn.loading,
	.ai-btn:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.ai-sparkle {
		font-size: 14px;
	}

	.basket-footer {
		padding: 14px 16px;
		border-top: 0.5px solid rgba(0, 0, 0, 0.12);
		background: #fff;
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
		color: #6b6b6b;
		font-family: system-ui, sans-serif;
	}

	.price-val {
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		font-family: system-ui, sans-serif;
	}

	.basket-btn {
		width: 100%;
		padding: 11px;
		background: #1a1a1a;
		color: #fff;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		letter-spacing: 0.04em;
		transition: opacity 0.15s;
		font-family: system-ui, sans-serif;
	}

	.basket-btn:hover:not(:disabled) {
		opacity: 0.82;
	}

	.basket-btn:disabled {
		background: #6b6b6b;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.basket-confirm {
		background: #f7f7f5;
		border-radius: 8px;
		padding: 10px;
		text-align: center;
	}

	.basket-confirm p {
		font-size: 13px;
		color: #1a1a1a;
		font-weight: 600;
		margin: 0;
		font-family: system-ui, sans-serif;
	}

	.basket-confirm small {
		font-size: 11px;
		color: #6b6b6b;
		font-family: system-ui, sans-serif;
	}
</style>
