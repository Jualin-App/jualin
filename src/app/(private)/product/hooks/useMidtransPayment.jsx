import { useState, useEffect } from "react";

export default function useMidtransPayment() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

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

  const openSnap = (snapToken, snapUrl) => {
    if (window.snap && snapToken) {
      window.snap.pay(snapToken, {
        onSuccess: () =>
          setToast({ message: "Pembayaran berhasil", type: "success" }),
        onPending: () =>
          setToast({
            message: "Pembayaran tertunda. Cek riwayat untuk melanjutkan.",
            type: "info",
          }),
        onError: () => setToast({ message: "Pembayaran gagal", type: "error" }),
        onClose: () =>
          setToast({ message: "Pembayaran dibatalkan", type: "info" }),
      });
    } else if (snapUrl) {
      window.open(snapUrl, "_blank");
    } else {
      setToast({ message: "Tidak dapat membuka pembayaran", type: "error" });
    }
  };

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

      const payRes = await fetch(
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
      const payData = await payRes.json();
      if (!payRes.ok || !payData.data) throw new Error(payData.message);

      openSnap(payData.data.snap_token, payData.data.snap_url);
    } catch (err) {
      setToast({
        message: err.message || "Failed to process payment",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const continuePayment = async (transactionId) => {
    if (!transactionId) return;
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      const payRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            transaction_id: transactionId,
            customer_details: {
              first_name: user.username || "User",
              last_name: user.username || "User",
              email: user.email || "user@example.com",
              phone: "081234567890",
            },
          }),
        }
      );
      const payData = await payRes.json();
      if (!payRes.ok || !payData.data) throw new Error(payData.message);

      openSnap(payData.data.snap_token, payData.data.snap_url);
    } catch (err) {
      setToast({
        message: err.message || "Gagal melanjutkan pembayaran",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { pay, continuePayment, loading, toast, setToast };
}
