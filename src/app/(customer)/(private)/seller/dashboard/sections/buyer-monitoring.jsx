"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { Search, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const BuyerMonitoringSection = ({ orders = [] }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const buyerActivities = orders.length > 0 ? orders.map(order => ({
    id: order.id,
    buyerName: order.buyer?.name || "Unknown Buyer",
    productName: order.items?.[0]?.product?.name || "Product",
    amount: order.total_amount || 0,
    status: order.status || "pending",
    time: order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : "Recently",
    avatar: order.buyer?.avatar || "/ProfilePhoto.png"
  })) : [
    { id: 1, buyerName: "Budi Santoso", productName: "Galaxy S25 5G", amount: 15000000, status: "pending", time: "11/02/15, 23:13", avatar: "/ProfilePhoto.png" },
    { id: 2, buyerName: "Siti Nurhaliza", productName: "C55 5G", amount: 2500000, status: "processing", time: "11/02/15, 23:13", avatar: "/ProfilePhoto.png" },
    { id: 3, buyerName: "Ahmad Dahlan", productName: "Find XT Pro 5G", amount: 8000000, status: "verified", time: "11/02/15, 23:13", avatar: "/ProfilePhoto.png" },
    { id: 4, buyerName: "Rina Marlina", productName: "Galaxy S25 5G", amount: 15000000, status: "completed", time: "11/02/15, 23:13", avatar: "/ProfilePhoto.png" },
    { id: 5, buyerName: "Bayu", productName: "Yeezy 700 V3", amount: 1700000, status: "processing", time: "11/02/15, 23:13", avatar: "/ProfilePhoto.png" },
    { id: 6, buyerName: "Nadia", productName: "Climacool 2020", amount: 1700000, status: "processing", time: "11/02/15, 23:13", avatar: "/ProfilePhoto.png" },
    { id: 7, buyerName: "Rizal", productName: "Climacool 2020", amount: 1700000, status: "processing", time: "11/02/15, 23:13", avatar: "/ProfilePhoto.png" },
    { id: 8, buyerName: "Tia", productName: "Yeezy 700 V3", amount: 1700000, status: "processing", time: "11/02/15, 23:13", avatar: "/ProfilePhoto.png" },
  ];

  const handleVerifyOrder = (orderId) => router.push(`/seller/orders/${orderId}/verify`);
  const handleChatBuyer = (buyerId) => router.push(`/chat?user=${buyerId}`);
  const handleViewDetails = (orderId) => router.push(`/seller/orders/${orderId}`);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "Pending", class: "bg-red-100 text-red-700 border border-red-200" },
      verified: { text: "Verified", class: "bg-green-100 text-green-700 border border-green-200" },
      processing: { text: "Processing", class: "bg-blue-100 text-blue-700 border border-blue-200" },
      completed: { text: "Completed", class: "bg-gray-100 text-gray-700 border border-gray-200" },
    };
    return badges[status] || badges.processing;
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = q
      ? buyerActivities.filter((b) =>
          [b.buyerName, b.productName, b.status].some((t) => String(t).toLowerCase().includes(q))
        )
      : buyerActivities;
    const start = (currentPage - 1) * perPage;
    return base.slice(start, start + perPage);
  }, [buyerActivities, searchQuery, currentPage, perPage]);

  const totalCount = buyerActivities.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Buyer</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Pembeli..."
            className="w-full px-4 py-2 pr-10 border rounded-full border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none"
          />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-brand-red text-white flex items-center justify-center">
            <Search className="h-4 w-4" />
          </button>
        </div>
        <div>
          <select defaultValue="7days" className="w-full sm:w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="text-left py-3 px-2 font-medium">Item</th>
              <th className="text-left py-3 px-2 font-medium">Category</th>
              <th className="text-left py-3 px-2 font-medium">Date</th>
              <th className="text-left py-3 px-2 font-medium">Time</th>
              <th className="text-left py-3 px-2 font-medium">Buyer</th>
              <th className="text-left py-3 px-2 font-medium">Status</th>
              <th className="py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((activity, index) => (
              <tr key={activity.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-3 px-2">
                  <img src="/colorful-sneaker-shoe-product.jpg" alt="Product" className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="py-3 px-2"><span className="font-medium text-gray-900">Shoe</span></td>
                <td className="py-3 px-2 text-gray-600">{activity.time.split(',')[0]}</td>
                <td className="py-3 px-2 text-gray-600">{activity.time.split(',')[1]}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <img src={activity.avatar} alt={activity.buyerName} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-gray-900">{activity.buyerName}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(activity.status).class}`}>
                    {getStatusBadge(activity.status).text}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <DropdownMenu
                    trigger={<MoreHorizontal className="h-5 w-5 text-gray-400" />}
                    items={[
                      ...(activity.status === 'pending' ? [
                        { label: "Verifikasi Order", onClick: () => handleVerifyOrder(activity.id) }
                      ] : []),
                      { label: "Chat Pembeli", onClick: () => handleChatBuyer(activity.buyerName) },
                      { label: "Lihat Detail", onClick: () => handleViewDetails(activity.id) }
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <p className="text-sm text-gray-600">Total Buyer: <span className="font-semibold text-gray-900">{totalCount}</span></p>
        <div className="flex items-center gap-1">
          <button className="h-8 w-8 rounded-md border border-gray-300 flex items-center justify-center" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const active = currentPage === page;
            return (
              <button
                key={page}
                className={`h-8 w-8 rounded-md border flex items-center justify-center ${active ? "bg-brand-red text-white border-brand-red" : "border-gray-300"}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button className="h-8 w-8 rounded-md border border-gray-300 flex items-center justify-center" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show per page:</span>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="w-16 h-8 border border-gray-300 rounded-md px-2">
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BuyerMonitoringSection;
