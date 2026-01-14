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

export default function CheckoutPage() {
  const [sessionKey, setSessionKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSessionKey(ensureSessionKey());
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_key: sessionKey,
          email: data.get("email"),
          full_name: data.get("full_name"),
          address: data.get("address"),
          city: data.get("city"),
          postal_code: data.get("postal_code"),
          country: data.get("country"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Order failed");
      setMessage(`Order placed! #${json.id}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={submit} className="space-y-4">
        <input name="email" required type="email" placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input name="full_name" required placeholder="Full name" className="w-full border rounded px-3 py-2" />
        <input name="address" required placeholder="Address" className="w-full border rounded px-3 py-2" />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" required placeholder="City" className="border rounded px-3 py-2" />
          <input name="postal_code" required placeholder="Postal code" className="border rounded px-3 py-2" />
        </div>
        <input name="country" required placeholder="Country" className="w-full border rounded px-3 py-2" />
        <button disabled={submitting} className="w-full bg-black text-white rounded py-2">
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}


