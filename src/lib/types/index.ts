export interface Design {
	id: string;
	name: string;
	description: string;
	paperSize: string;
	technique: string;
	price: number; // pence
	currency: string;
	gelatoProductUid: string;
	available: boolean;
}

export interface ShippingAddress {
	line1: string;
	line2: string | null;
	city: string;
	postcode: string;
	country: string;
}

export interface Order {
	id: string;
	designId: string;
	letter: string;
	customerName: string;
	customerEmail: string;
	shippingAddress: ShippingAddress;
	stripePaymentIntentId: string;
	gelatoOrderId: string | null;
	status: 'pending' | 'paid' | 'submitted_to_gelato' | 'failed';
	createdAt: string;
}

export interface CartItem {
	design: Design;
	letter: string;
}
