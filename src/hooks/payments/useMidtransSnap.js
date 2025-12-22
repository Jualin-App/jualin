import { useEffect, useState } from "react";

export default function useMidtransSnap() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = document.getElementById("midtrans-snap-script");
    if (existing) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "midtrans-snap-script";
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
    );
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  const openSnap = (snapToken, snapUrl, callbacks) => {
    if (typeof window === "undefined") return;
    if (window.snap && snapToken) {
      window.snap.pay(snapToken, callbacks || {});
    } else if (snapUrl) {
      window.open(snapUrl, "_blank");
    } else {
      throw new Error("Snap not available");
    }
  };

  return { loaded, openSnap };
}
