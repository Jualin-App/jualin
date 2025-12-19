import { useState, useEffect } from "react";

export default function useMidtransPayment() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Load Snap JS sekali saja
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

  const pay = async (product) => {
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
          onSuccess: () =>
            setToast({
              message: "Pembayaran berhasil",
              type: "success",
            }),
          onPending: () =>
            setToast({
              message: "Pembayaran tertunda, Silakan cek riwayat transaksi untuk melanjutkan pembayaran",
              type: "info",
            }),
          onError: () =>
            setToast({
              message: "Pembayaran gagal",
              type: "error",
            }),
          onClose: () =>
            setToast({
              message:
                "Pembayaran dibatalkan",
              type: "info",
            }),
        });
      } else {
        window.open(paymentData.data.snap_url, "_blank");
      }
    } catch (err) {
      setToast({
        message: err.message || "Failed to process payment",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { pay, loading, toast, setToast };
}