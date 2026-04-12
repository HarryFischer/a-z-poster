import { getAllDesigns } from '$lib/posters.server.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const designs = getAllDesigns();
	return { designs };
};
