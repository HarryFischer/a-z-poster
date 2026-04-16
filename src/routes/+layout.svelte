<script lang="ts">
	import "../app.css";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<nav class="topbar">
	<a href="/" class="logo">A to Z Posters</a>
	<a href="/" class="nav-link">Shop</a>
</nav>

<main>
	{@render children()}
</main>

<style>
	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 24px;
		border-bottom: 0.5px solid var(--border);
		background: var(--bg);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.logo {
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.nav-link {
		font-size: 13px;
		color: var(--text-secondary);
		transition: color 0.15s;
	}

	.nav-link:hover {
		color: var(--text);
	}

	main {
		min-height: calc(100vh - 48px);
	}
</style>
