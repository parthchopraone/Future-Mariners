"use client";

import { useState } from "react";

declare global { interface Window { Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, handler: () => void) => void }; } }

const CheckoutButton = ({ courseSlug }: { courseSlug: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    let response: Response;
    let data: { url?: string; orderId?: string; amount?: number; currency?: string; keyId?: string; name?: string; email?: string; error?: string };
    try {
      response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseSlug }) });
      data = await response.json();
    } catch {
      setError("Unable to connect to checkout. Please try again.");
      setLoading(false);
      return;
    }
    if (response.ok && data.url) { window.location.assign(data.url); return; }
    if (!response.ok || !data.orderId) { setError(data.error ?? "Unable to start checkout."); setLoading(false); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const checkout = new window.Razorpay({ key: data.keyId, amount: data.amount, currency: data.currency, name: "Future Mariners", description: data.name, order_id: data.orderId, prefill: { email: data.email ?? "" }, handler: async (payment: Record<string, string>) => {
        try {
          const verification = await fetch("/api/checkout/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payment) });
          if (verification.ok) window.location.assign("/checkout/success"); else setError("Payment was received but could not be verified yet.");
        } catch {
          setError("Payment completed, but verification could not be reached. Please contact support.");
        } finally {
          setLoading(false);
        }
      }, modal: { ondismiss: () => { setError("Checkout was cancelled."); setLoading(false); } }, theme: { color: "#7D52F4" } });
      checkout.on("payment.failed", () => { setError("Payment failed. No course access was granted."); setLoading(false); });
      checkout.open();
    };
    script.onerror = () => { setError("Unable to load Razorpay checkout."); setLoading(false); };
    document.body.appendChild(script);
  };

  return <div><button type="button" onClick={startCheckout} disabled={loading} className="w-full rounded-full bg-[#7D52F4] px-6 py-4 font-bold text-white hover:bg-purple-600 disabled:opacity-60">{loading ? "Opening checkout..." : "Pay securely with Razorpay →"}</button>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}</div>;
};

export default CheckoutButton;
