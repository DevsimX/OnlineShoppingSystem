"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
	product: { slug: string; name: string; images?: { image_url: string }[]; price_cents: number };
	quantity: number;
};

type Cart = {
	session_key: string;
	items: CartItem[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

function ensureSessionKey(): string {
	let key = typeof window !== "undefined" ? window.localStorage.getItem("cart_session_key") : null;
	if (!key) {
		key = Math.random().toString(36).slice(2) + Date.now().toString(36);
		if (typeof window !== "undefined") window.localStorage.setItem("cart_session_key", key);
	}
	return key!;
}

export default function CartPage() {
	const [sessionKey, setSessionKey] = useState<string>("");
	const [cart, setCart] = useState<Cart | null>(null);
	const subtotal = useMemo(() => {
		if (!cart) return 0;
		return cart.items.reduce((sum, it) => sum + it.product.price_cents * it.quantity, 0);
	}, [cart]);

	useEffect(() => {
		setSessionKey(ensureSessionKey());
	}, []);

	useEffect(() => {
		if (!sessionKey) return;
		fetch(`${API_BASE}/api/carts/${sessionKey}/`)
			.then((r) => (r.ok ? r.json() : Promise.reject()))
			.then((data) => setCart(data))
			.catch(() => setCart({ session_key: sessionKey, items: [] } as any));
	}, [sessionKey]);

	function remove(productSlug: string) {
		fetch(`${API_BASE}/api/carts/${sessionKey}/remove/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ product: productSlug }),
		})
			.then((r) => r.json())
			.then((data) => setCart(data));
	}

	return (
		<main className="mx-auto max-w-5xl px-6 py-10">
			<h1 className="text-3xl font-bold mb-6">Your Cart</h1>
			{!cart || cart.items.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-2 space-y-4">
						{cart.items.map((it) => (
							<div key={it.product.slug} className="flex items-center gap-4 border rounded p-3">
								<img src={it.product.images?.[0]?.image_url} className="w-20 h-20 object-cover rounded" alt={it.product.name} />
								<div className="flex-1">
									<div className="font-medium">{it.product.name}</div>
									<div className="text-gray-600">Qty: {it.quantity}</div>
								</div>
								<div className="text-right">
									<div>${((it.product.price_cents * it.quantity) / 100).toFixed(2)}</div>
									<button className="text-sm text-red-600" onClick={() => remove(it.product.slug)}>
										Remove
									</button>
								</div>
							</div>
						))}
					</div>
					<div className="border rounded p-4 h-fit">
						<div className="flex justify-between mb-2"><span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span></div>
						<a href="/checkout" className="block text-center mt-4 bg-black text-white rounded py-2">Checkout</a>
					</div>
				</div>
			)}
		</main>
	);
}
