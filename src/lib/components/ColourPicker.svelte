<script lang="ts">
	import { posterStore } from '$lib/stores/posterStore';

	let { bg, fg }: { bg: string; fg: string } = $props();

	const bgSwatches = ['#F5F0E8', '#1a1a1a', '#E8EDF5', '#F5E8E8', '#E8F5EE', '#2C2035'];
	const fgSwatches = ['#1a1a1a', '#F5F0E8', '#C1440E', '#1D5CA6', '#2E7D4F', '#C4A44A'];

	function setBg(color: string) {
		posterStore.update((s) => ({ ...s, bg: color }));
	}

	function setFg(color: string) {
		posterStore.update((s) => ({ ...s, fg: color }));
	}
</script>

<div class="color-row">
	<div class="color-group">
		<span class="group-label">Background</span>
		<div class="swatch-row">
			{#each bgSwatches as color}
				<button
					class="swatch"
					class:active={bg === color}
					style="background:{color};{bg === color ? 'border-color:' + fg + ';' : ''}"
					onclick={() => setBg(color)}
					aria-label="Background {color}"
				></button>
			{/each}
		</div>
	</div>
	<div class="color-group">
		<span class="group-label">Foreground</span>
		<div class="swatch-row">
			{#each fgSwatches as color}
				<button
					class="swatch"
					class:active={fg === color}
					style="background:{color};{fg === color ? 'border-color:' + bg + ';' : ''}"
					onclick={() => setFg(color)}
					aria-label="Foreground {color}"
				></button>
			{/each}
		</div>
	</div>
</div>

<style>
	.color-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.color-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.group-label {
		font-size: 12px;
		color: #6b6b6b;
		font-family: system-ui, sans-serif;
	}

	.swatch-row {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
	}

	.swatch {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		cursor: pointer;
		border: 2px solid transparent;
		transition: transform 0.12s;
		flex-shrink: 0;
		padding: 0;
	}

	.swatch:hover {
		transform: scale(1.15);
	}

	.swatch.active {
		border-width: 2px;
	}
</style>
