<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { cartItem, hasItem, clearItem } from '$lib/stores/cartStore.js';
	import { getPreviewUrl } from '$lib/posters.js';
	import { onMount } from 'svelte';
	import type { Stripe, StripeCardElement } from '@stripe/stripe-js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let stripe: Stripe | null = $state(null);
	let cardElement: StripeCardElement | null = $state(null);
	let cardMounted = $state(false);
	let error = $state('');
	let loading = $state(false);

	// Form fields
	let fullName = $state('');
	let email = $state('');
	let line1 = $state('');
	let line2 = $state('');
	let city = $state('');
	let postcode = $state('');
	let country = $state('United Kingdom');

	// Redirect if no item
	$effect(() => {
		if (browser && !$hasItem) {
			goto('/');
		}
	});

	onMount(async () => {
		if (!$hasItem) return;

		const { loadStripe } = await import('@stripe/stripe-js');
		const publishableKey = data.stripePublishableKey;

		stripe = await loadStripe(publishableKey);
		if (!stripe) return;

		const elements = stripe.elements();
		cardElement = elements.create('card', {
			style: {
				base: {
					fontFamily: 'system-ui, sans-serif',
					fontSize: '15px',
					color: '#1a1a1a',
					'::placeholder': { color: '#6b6b6b' }
				}
			}
		});
		cardElement.mount('#card-element');
		cardMounted = true;
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!stripe || !cardElement || !$cartItem) return;

		error = '';
		loading = true;

		try {
			const { design, letter } = $cartItem;

			// 1. Create payment intent
			const res = await fetch('/api/create-payment-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					designId: design.id,
					letter,
					amount: design.price,
					currency: design.currency,
					customerEmail: email,
					customerName: fullName,
					shippingAddress: { line1, line2: line2 || null, city, postcode, country }
				})
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error ?? 'Failed to create payment');
			}

			const { clientSecret } = await res.json();

			// 2. Confirm card payment
			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement,
					billing_details: {
						name: fullName,
						email,
						address: {
							line1,
							line2: line2 || undefined,
							city,
							postal_code: postcode,
							country: 'GB'
						}
					}
				},
				shipping: {
					name: fullName,
					address: {
						line1,
						line2: line2 || undefined,
						city,
						postal_code: postcode,
						country: 'GB'
					}
				}
			});

			if (result.error) {
				throw new Error(result.error.message ?? 'Payment failed');
			}

			clearItem();
			goto(`/success?letter=${encodeURIComponent(letter)}&design=${encodeURIComponent(design.id)}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong';
			loading = false;
		}
	}

	function formatPrice(pence: number, currency: string): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: currency.toUpperCase(),
			minimumFractionDigits: 0
		}).format(pence / 100);
	}
</script>

<svelte:head>
	<title>Checkout — Letterform</title>
</svelte:head>

{#if $cartItem}
	<div class="page">
		<!-- Order summary -->
		<aside class="summary">
			<div class="summary-inner">
				<h2 class="summary-title">Your order</h2>
				<div class="summary-card">
					<div class="summary-image">
						<img
							src={getPreviewUrl($cartItem.design.id, $cartItem.letter)}
							alt="Letter {$cartItem.letter}"
						/>
					</div>
					<div class="summary-details">
						<p class="summary-design">{$cartItem.design.name}</p>
						<p class="summary-letter">Letter {$cartItem.letter}</p>
						<p class="summary-size">{$cartItem.design.paperSize} · {$cartItem.design.technique}</p>
						<p class="summary-price">
							{formatPrice($cartItem.design.price, $cartItem.design.currency)}
						</p>
					</div>
				</div>
			</div>
		</aside>

		<!-- Checkout form -->
		<div class="form-area">
			<form onsubmit={handleSubmit} class="form">
				<h1 class="form-title">Checkout</h1>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Your details</legend>
					<div class="field">
						<label for="fullName">Full name</label>
						<input id="fullName" type="text" bind:value={fullName} required autocomplete="name" />
					</div>
					<div class="field">
						<label for="email">Email address</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							autocomplete="email"
						/>
					</div>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Shipping address</legend>
					<div class="field">
						<label for="line1">Address line 1</label>
						<input
							id="line1"
							type="text"
							bind:value={line1}
							required
							autocomplete="address-line1"
						/>
					</div>
					<div class="field">
						<label for="line2">Address line 2 <span class="optional">(optional)</span></label>
						<input id="line2" type="text" bind:value={line2} autocomplete="address-line2" />
					</div>
					<div class="field-row">
						<div class="field">
							<label for="city">City</label>
							<input id="city" type="text" bind:value={city} required autocomplete="address-level2" />
						</div>
						<div class="field">
							<label for="postcode">Postcode</label>
							<input id="postcode" type="text" bind:value={postcode} required autocomplete="postal-code" />
						</div>
					</div>
					<div class="field">
						<label for="country">Country</label>
						<input
							id="country"
							type="text"
							bind:value={country}
							required
							autocomplete="country-name"
						/>
					</div>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Payment</legend>
					<div class="field">
						<label for="card-element">Card details</label>
						<div id="card-element" class="card-element-wrap" class:mounted={cardMounted}></div>
					</div>
				</fieldset>

				{#if error}
					<p class="error-msg">{error}</p>
				{/if}

				<button type="submit" class="btn-pay" disabled={loading || !cardMounted}>
					{#if loading}
						Processing…
					{:else}
						Pay {formatPrice($cartItem.design.price, $cartItem.design.currency)}
					{/if}
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.page {
		display: grid;
		grid-template-columns: 380px 1fr;
		min-height: calc(100vh - 48px);
	}

	/* Summary */
	.summary {
		background: var(--bg-secondary);
		border-right: 0.5px solid var(--border);
	}

	.summary-inner {
		padding: 40px 32px;
		position: sticky;
		top: 48px;
	}

	.summary-title {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-secondary);
		margin-bottom: 20px;
	}

	.summary-card {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}

	.summary-image {
		width: 80px;
		flex-shrink: 0;
		aspect-ratio: 1 / 1.414;
		background: var(--bg-tertiary);
		border: 0.5px solid var(--border);
		border-radius: 4px;
		overflow: hidden;
	}

	.summary-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.summary-details {
		flex: 1;
	}

	.summary-design {
		font-size: 15px;
		font-weight: 600;
		margin-bottom: 4px;
	}

	.summary-letter {
		font-size: 13px;
		color: var(--text-secondary);
		margin-bottom: 2px;
	}

	.summary-size {
		font-size: 12px;
		color: var(--text-secondary);
		margin-bottom: 10px;
	}

	.summary-price {
		font-size: 18px;
		font-weight: 600;
	}

	/* Form */
	.form-area {
		padding: 40px;
		max-width: 540px;
	}

	.form-title {
		font-size: 24px;
		font-weight: 600;
		margin-bottom: 32px;
	}

	.fieldset {
		border: none;
		padding: 0;
		margin-bottom: 28px;
	}

	.fieldset-legend {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-secondary);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 14px;
		width: 100%;
		border-bottom: 0.5px solid var(--border);
		padding-bottom: 8px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-bottom: 12px;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	label {
		font-size: 13px;
		color: var(--text-secondary);
	}

	.optional {
		font-weight: 400;
	}

	input {
		padding: 9px 12px;
		border: 0.5px solid var(--border);
		border-radius: var(--radius);
		font-size: 14px;
		font-family: inherit;
		color: var(--text);
		background: var(--bg);
		outline: none;
		transition: border-color 0.15s;
	}

	input:focus {
		border-color: var(--border-active);
	}

	.card-element-wrap {
		padding: 10px 12px;
		border: 0.5px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg);
		min-height: 40px;
		transition: border-color 0.15s;
	}

	.card-element-wrap.mounted {
		border-color: var(--border);
	}

	.error-msg {
		font-size: 13px;
		color: #c0392b;
		margin-bottom: 14px;
		padding: 10px 12px;
		background: #fdf2f2;
		border: 0.5px solid #e8b4b4;
		border-radius: var(--radius);
	}

	.btn-pay {
		width: 100%;
		padding: 13px;
		background: var(--text);
		color: var(--bg);
		border: none;
		border-radius: var(--radius);
		font-size: 15px;
		font-weight: 600;
		letter-spacing: 0.03em;
		transition: opacity 0.15s;
	}

	.btn-pay:hover:not(:disabled) {
		opacity: 0.82;
	}

	.btn-pay:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	@media (max-width: 800px) {
		.page {
			grid-template-columns: 1fr;
		}

		.summary {
			border-right: none;
			border-bottom: 0.5px solid var(--border);
		}

		.summary-inner {
			position: static;
		}

		.form-area {
			padding: 28px 24px;
		}
	}
</style>
