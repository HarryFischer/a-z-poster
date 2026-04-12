import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	return { stripePublishableKey: PUBLIC_STRIPE_PUBLISHABLE_KEY };
};
