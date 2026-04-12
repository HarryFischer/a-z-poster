import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Design } from './types/index.js';

const POSTERS_DIR = 'static/posters';

function loadDesigns(): Design[] {
	try {
		const entries = readdirSync(POSTERS_DIR, { withFileTypes: true });
		return entries
			.filter((d) => d.isDirectory())
			.map((d) => {
				const metaPath = join(POSTERS_DIR, d.name, 'meta.json');
				return JSON.parse(readFileSync(metaPath, 'utf-8')) as Design;
			})
			.sort((a, b) => a.id.localeCompare(b.id));
	} catch (e) {
		console.error('Failed to load designs:', e);
		return [];
	}
}

export function getAllDesigns(): Design[] {
	return loadDesigns();
}

export function getDesign(id: string): Design | undefined {
	return loadDesigns().find((d) => d.id === id);
}
