import { writable, derived } from 'svelte/store';
import type { CartItem, Design } from '../types/index.js';

const cartItemStore = writable<CartItem | null>(null);

export const cartItem = { subscribe: cartItemStore.subscribe };

export const hasItem = derived(cartItemStore, ($item) => $item !== null);

export function setItem(design: Design, letter: string): void {
	cartItemStore.set({ design, letter });
}

export function clearItem(): void {
	cartItemStore.set(null);
}
