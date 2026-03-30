<script lang="ts">
	import { posterStore, totalPrice, isReadyToOrder } from '$lib/stores/posterStore';
	import PosterCanvas from '$lib/components/PosterCanvas.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
</script>

<div class="app">
	<div class="canvas-area">
		<div class="topbar">
			<span class="topbar-logo">Letterform</span>
			<span class="topbar-step">Design your poster</span>
		</div>
		<PosterCanvas posterState={$posterStore} />
	</div>

	<div class="panel-wrap">
		<ControlPanel posterState={$posterStore} totalPrice={$totalPrice} isReadyToOrder={$isReadyToOrder} />
	</div>
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #efefeb;
		color: #1a1a1a;
		min-height: 100vh;
	}

	.app {
		display: grid;
		grid-template-columns: 1fr 360px;
		height: 100vh;
		overflow: hidden;
	}

	.canvas-area {
		display: flex;
		flex-direction: column;
		background: #f7f7f5;
		overflow: hidden;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 16px;
		background: #fff;
		border-bottom: 0.5px solid rgba(0, 0, 0, 0.12);
		flex-shrink: 0;
	}

	.topbar-logo {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.1em;
	}

	.topbar-step {
		font-size: 12px;
		color: #6b6b6b;
	}

	.panel-wrap {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
