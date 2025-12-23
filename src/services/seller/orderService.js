import { fetcher } from "@/lib/fetcher";

export const orderService = {
  async fetchSellerOrders(params = {}) {
    const { status = "all", limit = 10 } = params;
    const resp = await fetcher.get("/api/v1/transactions", {
      params: {
        per_page: limit,
        status: status === "all" ? undefined : status,
      },
    });
    const payload = resp?.data;
    if (payload?.data && Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
  },

  async verifyOrder(orderId) {
    try {
      const resp = await fetcher.post(`/api/v1/transactions/${orderId}`, {
        status: "verified",
      });
      return !!resp?.success;
    } catch (error) {
      console.error(`Error verifying order ${orderId}:`, error);
      return false;
    }
  },

  async fetchIncome(sellerId, period = "Month") {
    const resp = await fetcher.get("/api/v1/transactions", {
      params: { period, seller_id: sellerId },
    });
    return resp?.data;
  },
};

export default orderService;
