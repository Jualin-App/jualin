"use client";
import React, { useEffect, useState } from "react";

export default function ProductDetailSection({ product }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!document.getElementById("midtrans-snap-script")) {
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
      );
      script.async = true;
      script.onload = () => console.log("Snap JS loaded");
      document.body.appendChild(script);
    }
  }, []);

  const handleBuyNow = async () => {
    if (!product) return;
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      const trxRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            seller_id: product.seller_id,
            items: [{ product_id: product.id, quantity: 1 }],
          }),
        }
      );
      const trxData = await trxRes.json();
      if (!trxRes.ok || !trxData.data) throw new Error(trxData.message);

      const paymentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            transaction_id: trxData.data.id,
            customer_details: {
              first_name: user.username || "User",
              last_name: user.username || "User",
              email: user.email || "user@example.com",
              phone: "081234567890",
            },
          }),
        }
      );
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok || !paymentData.data)
        throw new Error(paymentData.message);

      if (window.snap && paymentData.data.snap_token) {
        window.snap.pay(paymentData.data.snap_token, {
          onSuccess: () => alert("Payment success!"),
          onPending: () => alert("Payment pending!"),
          onError: () => alert("Payment failed!"),
          onClose: () => console.log("Customer closed the popup"),
        });
      } else {
        window.open(paymentData.data.snap_url, "_blank");
      }
    } catch (err) {
      alert(err.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  if (!product)
    return <div className="text-center py-12">No product selected</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start bg-white rounded-2xl shadow p-6">
      <img
        src={product.img || "https://via.placeholder.com/400x400?text=No+Image"}
        alt={product.name}
        className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">
          {product.brand || product.category}
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-black">
          {product.name}
        </h2>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <span className="block font-bold text-xl text-black mb-6">
          Rp {product.price}
        </span>
        <button
          className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition"
          onClick={handleBuyNow}
          disabled={loading}
        >
          {loading ? "Processing..." : "Buy Now!"}
        </button>
      </div>
    </div>
  );
}
