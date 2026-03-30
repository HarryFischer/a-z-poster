<script lang="ts">
	import type { FontChoice } from '$lib/types/poster';
	import { posterStore } from '$lib/stores/posterStore';

	let { fg, activeFont }: { fg: string; activeFont: FontChoice } = $props();

	const fonts: { id: FontChoice; label: string; family: string; style?: string }[] = [
		{ id: 'playfair', label: 'Playfair', family: "'Playfair Display', serif" },
		{ id: 'bebas', label: 'Bebas', family: "'Bebas Neue', sans-serif" },
		{ id: 'dm-serif', label: 'DM Serif', family: "'DM Serif Display', serif", style: 'italic' },
		{ id: 'space-mono', label: 'Mono', family: "'Space Mono', monospace" },
		{ id: 'cormorant', label: 'Cormorant', family: "'Cormorant Garamond', serif" }
	];

	function select(id: FontChoice) {
		posterStore.update((s) => ({ ...s, font: id }));
	}
</script>

<div class="font-grid">
	{#each fonts as f}
		<button
			class="font-btn"
			class:active={activeFont === f.id}
			style={activeFont === f.id ? `border-color:${fg};` : ''}
			onclick={() => select(f.id)}
		>
			<span class="sample" style="font-family:{f.family};{f.style ? 'font-style:' + f.style + ';' : ''}"
				>A</span
			>
			<span class="fname">{f.label}</span>
		</button>
	{/each}
</div>

<style>
	.font-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
	}

	.font-btn {
		border: 0.5px solid rgba(0, 0, 0, 0.12);
		border-radius: 8px;
		padding: 8px 4px;
		cursor: pointer;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		transition: border-color 0.15s, background 0.15s;
	}

	.font-btn:hover {
		background: #f7f7f5;
		border-color: rgba(0, 0, 0, 0.22);
	}

	.font-btn.active {
		border-width: 1.5px;
		background: #f7f7f5;
	}

	.sample {
		font-size: 18px;
		color: #1a1a1a;
		line-height: 1;
	}

	.fname {
		font-size: 9px;
		color: #6b6b6b;
		text-align: center;
		font-family: system-ui, sans-serif;
	}
</style>
