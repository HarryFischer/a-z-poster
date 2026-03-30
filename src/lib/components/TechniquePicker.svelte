<script lang="ts">
	import type { PrintTechnique } from '$lib/types/poster';
	import { posterStore } from '$lib/stores/posterStore';

	let { activeTechnique, fg }: { activeTechnique: PrintTechnique; fg: string } = $props();

	const techniques: PrintTechnique[] = [
		{ id: 'risograph', label: 'Risograph', description: 'Layered ink, slight grain, vibrant hues', price: 12 },
		{ id: 'letterpress', label: 'Letterpress', description: 'Deep emboss, tactile impression', price: 18 },
		{ id: 'screen-print', label: 'Screen print', description: 'Bold, opaque ink, hand-finished', price: 15 },
		{ id: 'giclee', label: 'Giclée', description: 'Fine art archival inkjet print', price: 8 }
	];

	function select(t: PrintTechnique) {
		posterStore.update((s) => ({ ...s, technique: t }));
	}
</script>

<div class="technique-grid">
	{#each techniques as t}
		<button
			class="tech-btn"
			class:active={activeTechnique.id === t.id}
			style={activeTechnique.id === t.id ? `border-color:${fg};` : ''}
			onclick={() => select(t)}
		>
			<div class="tech-name">{t.label}</div>
			<div class="tech-desc">{t.description}</div>
			<div class="tech-price">+£{t.price}</div>
		</button>
	{/each}
</div>

<style>
	.technique-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 6px;
	}

	.tech-btn {
		border: 0.5px solid rgba(0, 0, 0, 0.12);
		border-radius: 8px;
		padding: 10px;
		cursor: pointer;
		background: #fff;
		text-align: left;
		transition: border-color 0.15s, background 0.15s;
	}

	.tech-btn:hover {
		background: #f7f7f5;
		border-color: rgba(0, 0, 0, 0.22);
	}

	.tech-btn.active {
		border-width: 1.5px;
		background: #f7f7f5;
	}

	.tech-name {
		font-size: 12px;
		font-weight: 600;
		color: #1a1a1a;
		font-family: system-ui, sans-serif;
	}

	.tech-desc {
		font-size: 10px;
		color: #6b6b6b;
		margin-top: 2px;
		line-height: 1.4;
		font-family: system-ui, sans-serif;
	}

	.tech-price {
		font-size: 10px;
		color: #6b6b6b;
		margin-top: 4px;
		font-weight: 600;
		font-family: system-ui, sans-serif;
	}
</style>
