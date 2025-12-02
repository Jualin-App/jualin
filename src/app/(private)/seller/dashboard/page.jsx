import IncomeSection from "./sections/income.jsx";
import RecentlyAddedSection from "./sections/recently-added.jsx";
import BuyerMonitoringSection from "./sections/buyer-monitoring.jsx";
import { fetchSellerProducts, fetchSellerOrders } from "@/modules/seller/service.js";

export default async function SellerDashboardPage() {
  // For now, we'll use mock data since we need seller authentication
  // In real implementation, get sellerId from session/auth context
  const sellerId = 1; // Mock seller ID
  
  const products = await fetchSellerProducts(sellerId);
  const orders = await fetchSellerOrders(sellerId, 'all', 4);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <IncomeSection sellerId={sellerId} />
        <RecentlyAddedSection products={products.length > 0 ? products : []} />
        <BuyerMonitoringSection orders={orders} />
      </div>
    </main>
  );
}
