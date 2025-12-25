import { fetcher } from "@/lib/fetcher";

export const orderService = {
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
