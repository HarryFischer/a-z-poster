import { STRIPE_SECRET_KEY } from '$env/static/private';
import { getDesign } from '$lib/posters.server.js';
import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);

	if (!body) {
		error(400, 'Invalid request body');
	}

	const { designId, letter, amount, currency, customerEmail, customerName, shippingAddress } = body;

	if (!designId || !letter || !amount || !currency || !customerEmail) {
		error(400, 'Missing required fields');
	}

	const design = getDesign(designId);
	if (!design) {
		error(404, 'Design not found');
	}

	// Security: verify amount matches design price
	if (amount !== design.price || currency.toLowerCase() !== design.currency.toLowerCase()) {
		error(400, 'Price mismatch');
	}

	const paymentIntent = await stripe.paymentIntents.create({
		amount: design.price,
		currency: design.currency,
		receipt_email: customerEmail,
		metadata: {
			designId,
			letter,
			customerEmail,
			customerName: customerName ?? ''
		},
		shipping: shippingAddress
			? {
					name: customerName ?? '',
					address: {
						line1: shippingAddress.line1,
						line2: shippingAddress.line2 ?? '',
						city: shippingAddress.city,
						postal_code: shippingAddress.postcode,
						country: 'GB'
					}
				}
			: undefined
	});

	return json({ clientSecret: paymentIntent.client_secret });
};
