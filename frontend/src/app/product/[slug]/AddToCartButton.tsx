"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

function ensureSessionKey(): string {
	let key = typeof window !== "undefined" ? window.localStorage.getItem("cart_session_key") : null;
	if (!key) {
		key = Math.random().toString(36).slice(2) + Date.now().toString(36);
		if (typeof window !== "undefined") window.localStorage.setItem("cart_session_key", key);
	}
	return key!;
}

export default function AddToCartButton({ productSlug }: { productSlug: string }) {
	const [sessionKey, setSessionKey] = useState("");
	const [loading, setLoading] = useState(false);
	const [added, setAdded] = useState(false);

	useEffect(() => {
		setSessionKey(ensureSessionKey());
	}, []);

	async function addToCart() {
		setLoading(true);
		try {
			await fetch(`${API_BASE}/api/carts/${sessionKey}/add/`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ product: productSlug, quantity: 1 }),
			});
			setAdded(true);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex items-center gap-3">
			<button disabled={!sessionKey || loading} onClick={addToCart} className="px-4 py-2 bg-black text-white rounded disabled:opacity-50">
				{loading ? "Adding..." : "Add to cart"}
			</button>
			{added && <a href="/cart" className="text-sm underline">View cart</a>}
		</div>
	);
}
