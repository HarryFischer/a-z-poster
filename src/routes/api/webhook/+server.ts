import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, GELATO_API_KEY } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { getDesign } from '$lib/posters.server.js';
import { getPdfUrl } from '$lib/posters.js';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('stripe-signature');
	if (!signature) {
		return new Response('Missing signature', { status: 400 });
	}

	const rawBody = await request.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return new Response('Invalid signature', { status: 400 });
	}

	if (event.type === 'payment_intent.succeeded') {
		const paymentIntent = event.data.object as Stripe.PaymentIntent;
		await handlePaymentSucceeded(paymentIntent);
	}

	// Always return 200 to acknowledge receipt
	return json({ received: true });
};

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
	const { designId, letter, customerEmail, customerName } = paymentIntent.metadata;

	if (!designId || !letter || !customerEmail) {
		console.error('Webhook: missing metadata on PaymentIntent', paymentIntent.id);
		return;
	}

	const design = getDesign(designId);
	if (!design) {
		console.error('Webhook: design not found', designId);
		return;
	}

	const shipping = paymentIntent.shipping;
	if (!shipping?.address) {
		console.error('Webhook: no shipping address on PaymentIntent', paymentIntent.id);
		return;
	}

	const nameParts = (shipping.name ?? customerName ?? '').trim().split(/\s+/);
	const firstName = nameParts[0] ?? '';
	const lastName = nameParts.slice(1).join(' ') || firstName;

	const fileUrl = `${PUBLIC_BASE_URL}${getPdfUrl(designId, letter)}`;

	const gelatoBody = {
		orderType: 'order',
		orderReferenceId: paymentIntent.id,
		customerReferenceId: customerEmail,
		currency: 'GBP',
		items: [
			{
				itemReferenceId: `${designId}-${letter}`,
				productUid: design.gelatoProductUid,
				fileUrl,
				quantity: 1
			}
		],
		shipTo: {
			firstName,
			lastName,
			addressLine1: shipping.address.line1 ?? '',
			addressLine2: shipping.address.line2 ?? '',
			city: shipping.address.city ?? '',
			postCode: shipping.address.postal_code ?? '',
			country: shipping.address.country ?? 'GB',
			email: customerEmail
		}
	};

	try {
		const res = await fetch('https://order.gelatoapis.com/v4/orders', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': GELATO_API_KEY
			},
			body: JSON.stringify(gelatoBody)
		});

		const data = await res.json();

		if (!res.ok) {
			console.error('Gelato order failed:', res.status, data);
			return;
		}

		console.log('Gelato order created:', { id: data.id, status: data.status });
	} catch (err) {
		console.error('Gelato API error:', err);
	}
}
