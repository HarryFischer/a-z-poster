import { getDesign } from '$lib/posters.server.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const design = getDesign(params.id);
	if (!design) {
		error(404, 'Design not found');
	}
	return { design };
};
