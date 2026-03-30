<script lang="ts">
	import type { LayoutOption, PosterState } from '$lib/types/poster';
	import { posterStore } from '$lib/stores/posterStore';

	let { layouts, posterState }: { layouts: LayoutOption[]; posterState: PosterState } = $props();

	const MINI_W = 54;
	const MINI_H = 76;

	const FONT_MAP: Record<string, string> = {
		playfair: "'Playfair Display', serif",
		bebas: "'Bebas Neue', sans-serif",
		'dm-serif': "'DM Serif Display', serif",
		'space-mono': "'Space Mono', monospace",
		cormorant: "'Cormorant Garamond', serif"
	};

	let fontFamily = $derived(FONT_MAP[posterState.font] ?? "'Playfair Display', serif");

	function select(layout: LayoutOption) {
		posterStore.update((s) => ({ ...s, activeLayout: layout }));
	}

	function letterStyle(layout: LayoutOption) {
		const fs = MINI_W * layout.letterScale;
		const left = MINI_W * layout.letterX;
		const top = MINI_H * layout.letterY;
		const transform =
			layout.anchor === 'center'
				? `translate(-50%, -50%) rotate(${layout.rotation}deg)`
				: `translateY(-50%) rotate(${layout.rotation}deg)`;
		return `left:${left}px;top:${top}px;font-size:${fs}px;transform:${transform};font-family:${fontFamily};color:${posterState.fg};`;
	}

	function wordStyle(layout: LayoutOption) {
		const fs = MINI_W * layout.wordScale;
		const left = MINI_W * layout.wordX;
		const top = MINI_H * layout.wordY;
		const transform =
			layout.anchor === 'center'
				? `translate(-50%, -50%) rotate(${layout.rotation}deg)`
				: `translateY(-50%) rotate(${layout.rotation}deg)`;
		return `left:${left}px;top:${top}px;font-size:${fs}px;transform:${transform};font-family:${fontFamily};color:${posterState.fg};text-align:${layout.anchor === 'center' ? 'center' : 'left'};`;
	}
</script>

<div class="layout-picker">
	{#each layouts as layout}
		<button
			class="layout-thumb"
			class:active={posterState.activeLayout?.id === layout.id}
			style={posterState.activeLayout?.id === layout.id ? `border-color:${posterState.fg};` : ''}
			onclick={() => select(layout)}
		>
			<div class="mini-poster" style="background:{posterState.bg};">
				<svg
					class="mini-svg"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 {MINI_W} {MINI_H}"
					width={MINI_W}
					height={MINI_H}
				>
					{#if layout.decorativeElement === 'rule-bottom'}
						<line x1="0" y1={MINI_H * 0.78} x2={MINI_W} y2={MINI_H * 0.78} stroke={posterState.fg} stroke-width="0.7" opacity="0.3" />
					{:else if layout.decorativeElement === 'rule-full'}
						{#each Array(11) as _, i}
							<line x1="0" y1={(MINI_H / 10) * i} x2={MINI_W} y2={(MINI_H / 10) * i} stroke={posterState.fg} stroke-width="0.4" opacity="0.12" />
						{/each}
					{:else if layout.decorativeElement === 'double-border'}
						{@const m = MINI_W * 0.06}
						<rect x={m} y={m} width={MINI_W - m * 2} height={MINI_H - m * 2} fill="none" stroke={posterState.fg} stroke-width="0.8" opacity="0.35" />
						<rect x={m + 3} y={m + 3} width={MINI_W - m * 2 - 6} height={MINI_H - m * 2 - 6} fill="none" stroke={posterState.fg} stroke-width="0.4" opacity="0.2" />
					{:else if layout.decorativeElement === 'grid-lines'}
						{#each Array(10) as _, i}
							<line x1="0" y1={(MINI_H / 10) * i} x2={MINI_W} y2={(MINI_H / 10) * i} stroke={posterState.fg} stroke-width="0.4" opacity="0.1" />
						{/each}
					{:else if layout.decorativeElement === 'diagonal'}
						<line x1="0" y1={MINI_H} x2={MINI_W} y2="0" stroke={posterState.fg} stroke-width="0.4" opacity="0.15" />
					{/if}
				</svg>
				<div class="mini-letter" style={letterStyle(layout)}>
					{posterState.letter.toUpperCase()}
				</div>
				<div class="mini-word" style={wordStyle(layout)}>
					{posterState.word.toUpperCase()}
				</div>
			</div>
			<span class="layout-label">{layout.label}</span>
		</button>
	{/each}
</div>

<style>
	.layout-picker {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.layout-thumb {
		border: 0.5px solid rgba(0, 0, 0, 0.12);
		border-radius: 8px;
		padding: 6px;
		cursor: pointer;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		transition: border-color 0.15s, background 0.15s;
	}

	.layout-thumb:hover {
		background: #f7f7f5;
		border-color: rgba(0, 0, 0, 0.22);
	}

	.layout-thumb.active {
		border-width: 1.5px;
		background: #f7f7f5;
	}

	.mini-poster {
		position: relative;
		width: 54px;
		height: 76px;
		border-radius: 2px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.mini-svg {
		position: absolute;
		inset: 0;
	}

	.mini-letter {
		position: absolute;
		line-height: 1;
		font-weight: 700;
		z-index: 2;
		user-select: none;
	}

	.mini-word {
		position: absolute;
		letter-spacing: 0.08em;
		font-weight: 600;
		z-index: 2;
		user-select: none;
	}

	.layout-label {
		font-size: 9px;
		color: #6b6b6b;
		font-weight: 500;
		font-family: system-ui, sans-serif;
	}
</style>
