<script lang="ts">
	import type { PaperSize } from '$lib/types/poster';
	import { posterStore } from '$lib/stores/posterStore';

	let { activeSize, fg }: { activeSize: PaperSize; fg: string } = $props();

	const sizes: { size: PaperSize; iconW: number; iconH: number }[] = [
		{ size: { id: 'a5', label: 'A5', dims: '148×210mm', price: 9, aspectRatio: 1.414 }, iconW: 12, iconH: 17 },
		{ size: { id: 'a4', label: 'A4', dims: '210×297mm', price: 14, aspectRatio: 1.414 }, iconW: 14, iconH: 20 },
		{ size: { id: 'a3', label: 'A3', dims: '297×420mm', price: 22, aspectRatio: 1.414 }, iconW: 17, iconH: 24 },
		{ size: { id: '50x70', label: '50×70', dims: '500×700mm', price: 32, aspectRatio: 1.4 }, iconW: 14, iconH: 20 },
		{ size: { id: '30x30', label: '30×30', dims: 'Square', price: 18, aspectRatio: 1 }, iconW: 18, iconH: 18 },
		{ size: { id: 'a2', label: 'A2', dims: '420×594mm', price: 44, aspectRatio: 1.414 }, iconW: 20, iconH: 28 }
	];

	function select(size: PaperSize) {
		posterStore.update((s) => ({ ...s, paperSize: size }));
	}
</script>

<div class="size-grid">
	{#each sizes as { size, iconW, iconH }}
		<button
			class="size-btn"
			class:active={activeSize.id === size.id}
			style={activeSize.id === size.id ? `border-color:${fg};` : ''}
			onclick={() => select(size)}
		>
			<div class="size-icon">
				<div
					class="size-rect"
					style="width:{iconW}px;height:{iconH}px;{activeSize.id === size.id ? 'opacity:0.85;' : 'opacity:0.4;'}"
				></div>
			</div>
			<div class="size-name">{size.label}</div>
			<div class="size-dims">{size.dims}</div>
		</button>
	{/each}
</div>

<style>
	.size-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}

	.size-btn {
		border: 0.5px solid rgba(0, 0, 0, 0.12);
		border-radius: 8px;
		padding: 8px 4px;
		cursor: pointer;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		transition: border-color 0.15s, background 0.15s;
	}

	.size-btn:hover {
		background: #f7f7f5;
		border-color: rgba(0, 0, 0, 0.22);
	}

	.size-btn.active {
		border-width: 1.5px;
		background: #f7f7f5;
	}

	.size-icon {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		height: 26px;
	}

	.size-rect {
		background: #6b6b6b;
		border-radius: 1px;
	}

	.size-name {
		font-size: 10px;
		color: #6b6b6b;
		font-weight: 500;
		font-family: system-ui, sans-serif;
	}

	.size-dims {
		font-size: 9px;
		color: #6b6b6b;
		opacity: 0.7;
		font-family: system-ui, sans-serif;
	}
</style>
