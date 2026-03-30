import { writable, derived } from 'svelte/store';
import type { PosterState } from '$lib/types/poster';

const defaultState: PosterState = {
	letter: 'A',
	word: 'ATLAS',
	font: 'playfair',
	bg: '#F5F0E8',
	fg: '#1a1a1a',
	paperSize: {
		id: 'a4',
		label: 'A4',
		dims: '210×297mm',
		price: 14,
		aspectRatio: 1.414
	},
	technique: {
		id: 'risograph',
		label: 'Risograph',
		description: 'Layered ink, slight grain, vibrant hues',
		price: 12
	},
	activeLayout: null,
	generated: false
};

export const posterStore = writable<PosterState>(defaultState);

export const totalPrice = derived(posterStore, ($state) => $state.paperSize.price + $state.technique.price);

export const isReadyToOrder = derived(posterStore, ($state) => $state.generated === true);
