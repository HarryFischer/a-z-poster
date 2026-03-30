<script lang="ts">
	import type { PosterState } from '$lib/types/poster';

	let { posterState }: { posterState: PosterState } = $props();

	const FONT_MAP: Record<string, string> = {
		playfair: "'Playfair Display', serif",
		bebas: "'Bebas Neue', sans-serif",
		'dm-serif': "'DM Serif Display', serif",
		'space-mono': "'Space Mono', monospace",
		cormorant: "'Cormorant Garamond', serif"
	};

	let fontFamily = $derived(FONT_MAP[posterState.font] ?? "'Playfair Display', serif");
	let layout = $derived(posterState.activeLayout);

	let letterX = $derived(layout ? layout.letterX : 0.5);
	let letterY = $derived(layout ? layout.letterY : 0.42);
	let letterScale = $derived(layout ? layout.letterScale : 0.62);
	let wordX = $derived(layout ? layout.wordX : 0.5);
	let wordY = $derived(layout ? layout.wordY : 0.76);
	let wordScale = $derived(layout ? layout.wordScale : 0.09);
	let rotation = $derived(layout ? layout.rotation : 0);
	let anchor = $derived(layout ? layout.anchor : 'center');
	let decorativeElement = $derived(layout ? layout.decorativeElement : 'none');
	let aspectRatio = $derived(posterState.paperSize.aspectRatio);

	function getLetterStyle(posterWidth: number, posterHeight: number) {
		const fs = posterWidth * letterScale;
		const left = posterWidth * letterX;
		const top = posterHeight * letterY;
		const transform =
			anchor === 'center'
				? `translate(-50%, -50%) rotate(${rotation}deg)`
				: `translateY(-50%) rotate(${rotation}deg)`;
		return `left:${left}px;top:${top}px;font-size:${fs}px;transform:${transform};font-family:${fontFamily};color:${posterState.fg};`;
	}

	function getWordStyle(posterWidth: number, posterHeight: number) {
		const fs = posterWidth * wordScale;
		const left = posterWidth * wordX;
		const top = posterHeight * wordY;
		const transform =
			anchor === 'center'
				? `translate(-50%, -50%) rotate(${rotation}deg)`
				: `translateY(-50%) rotate(${rotation}deg)`;
		return `left:${left}px;top:${top}px;font-size:${fs}px;transform:${transform};font-family:${fontFamily};color:${posterState.fg};text-align:${anchor === 'center' ? 'center' : 'left'};`;
	}

	let containerEl: HTMLDivElement | undefined = $state();
	let posterWidth = $state(0);
	let posterHeight = $state(0);

	function updateSize() {
		if (!containerEl) return;
		const w = containerEl.offsetWidth;
		const h = containerEl.offsetHeight;
		const maxW = Math.min(w * 0.9, h * 0.88 / aspectRatio, 340);
		posterWidth = maxW;
		posterHeight = maxW * aspectRatio;
	}

	$effect(() => {
		if (containerEl) updateSize();
	});

	$effect(() => {
		// re-run when aspectRatio changes
		aspectRatio;
		if (containerEl) updateSize();
	});
</script>

<svelte:window onresize={updateSize} />

<div class="canvas-wrap" bind:this={containerEl}>
	{#if posterWidth > 0}
		<div
			class="poster"
			style="width:{posterWidth}px;height:{posterHeight}px;background:{posterState.bg};"
		>
			<svg
				class="poster-svg"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 {posterWidth} {posterHeight}"
			>
				{#if decorativeElement === 'rule-bottom'}
					<line
						x1="0"
						y1={posterHeight * 0.78}
						x2={posterWidth}
						y2={posterHeight * 0.78}
						stroke={posterState.fg}
						stroke-width="1"
						opacity="0.3"
					/>
				{:else if decorativeElement === 'rule-full'}
					{#each Array(11) as _, i}
						<line
							x1="0"
							y1={(posterHeight / 10) * i}
							x2={posterWidth}
							y2={(posterHeight / 10) * i}
							stroke={posterState.fg}
							stroke-width="0.6"
							opacity="0.12"
						/>
					{/each}
				{:else if decorativeElement === 'double-border'}
					{@const m = posterWidth * 0.06}
					<rect
						x={m}
						y={m}
						width={posterWidth - m * 2}
						height={posterHeight - m * 2}
						fill="none"
						stroke={posterState.fg}
						stroke-width="1"
						opacity="0.35"
					/>
					<rect
						x={m + 5}
						y={m + 5}
						width={posterWidth - m * 2 - 10}
						height={posterHeight - m * 2 - 10}
						fill="none"
						stroke={posterState.fg}
						stroke-width="0.5"
						opacity="0.2"
					/>
				{:else if decorativeElement === 'grid-lines'}
					{#each Array(10) as _, i}
						<line
							x1="0"
							y1={(posterHeight / 10) * i}
							x2={posterWidth}
							y2={(posterHeight / 10) * i}
							stroke={posterState.fg}
							stroke-width="0.5"
							opacity="0.1"
						/>
					{/each}
				{:else if decorativeElement === 'diagonal'}
					<line
						x1="0"
						y1={posterHeight}
						x2={posterWidth}
						y2="0"
						stroke={posterState.fg}
						stroke-width="0.5"
						opacity="0.15"
					/>
				{/if}
			</svg>

			<div class="poster-letter" style={getLetterStyle(posterWidth, posterHeight)}>
				{posterState.letter.toUpperCase()}
			</div>
			<div class="poster-word" style={getWordStyle(posterWidth, posterHeight)}>
				{posterState.word.toUpperCase()}
			</div>
			<div class="tech-badge" style="color:{posterState.fg};">
				{posterState.technique.label}
			</div>
		</div>
	{/if}
</div>

<style>
	.canvas-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 32px;
		overflow: hidden;
	}

	.poster {
		position: relative;
		overflow: hidden;
		box-shadow: 0 6px 40px rgba(0, 0, 0, 0.2);
		flex-shrink: 0;
	}

	.poster-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.poster-letter {
		position: absolute;
		line-height: 1;
		transition: left 0.3s ease, top 0.3s ease, font-size 0.3s ease, transform 0.3s ease;
		z-index: 2;
		user-select: none;
		font-weight: 700;
	}

	.poster-word {
		position: absolute;
		transition: left 0.3s ease, top 0.3s ease, font-size 0.3s ease, transform 0.3s ease;
		z-index: 2;
		user-select: none;
		letter-spacing: 0.12em;
		font-weight: 600;
	}

	.tech-badge {
		position: absolute;
		bottom: 6px;
		right: 8px;
		font-size: 8px;
		opacity: 0.35;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		z-index: 3;
		font-family: system-ui, sans-serif;
	}
</style>
