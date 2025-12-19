"use client";

import { useEffect, useState } from "react";
import IncomeSection from "./sections/income.jsx";
import RecentlyAddedSection from "./sections/recently-added.jsx";
import BuyerMonitoringSection from "./sections/buyer-monitoring.jsx";
import {
  fetchSellerProducts,
  fetchSellerOrders,
} from "@/modules/seller/service.js";

export default function SellerDashboardPage() {
  const [sellerId, setSellerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    // Ambil sellerId dari localStorage user (fallback ke 1 jika belum ada)
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null;

    const id = storedUser?.id || 1;
    setSellerId(id);

    const load = async () => {
      setIsLoadingProducts(true);
      try {
        const [p, o] = await Promise.all([
          fetchSellerProducts(id),
          fetchSellerOrders(id, "all", 4),
        ]);
        setProducts(Array.isArray(p) ? p : []);
        setOrders(Array.isArray(o) ? o : []);
      } catch (err) {
        console.error("Failed to load seller dashboard data:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    load();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <IncomeSection sellerId={sellerId || 1} />
        <RecentlyAddedSection products={products} isLoading={isLoadingProducts} />
        <BuyerMonitoringSection orders={orders} />
      </div>
    </main>
  );
}
