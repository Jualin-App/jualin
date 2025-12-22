import apiClient from "../api/client";
import { parseApiError } from "../api/errorHandler";

export const paymentService = {
  async getHistory() {
    try {
      const res = await apiClient.get("/api/v1/payments/history", {
        timeout: 20000,
      });
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (err) {
      throw parseApiError(err);
    }
  },

  async createOrContinuePayment(transactionId, customerDetails = {}) {
    try {
      const res = await apiClient.post(
        "/api/v1/payments/create",
        {
          transaction_id: transactionId,
          customer_details: customerDetails,
        },
        { timeout: 20000 }
      );
      return res.data?.data || {};
    } catch (err) {
      throw parseApiError(err);
    }
  },

  async checkStatus(orderId) {
    try {
      const res = await apiClient.get(`/api/v1/payments/status/${orderId}`, {
        timeout: 20000,
      });
      return res.data?.data || {};
    } catch (err) {
      throw parseApiError(err);
    }
  },

  async reissueToken(paymentId, customerDetails = {}) {
    try {
      const res = await apiClient.post(
        `/api/v1/payments/reissue/${paymentId}`,
        { customer_details: customerDetails },
        { timeout: 20000 }
      );
      return res.data?.data || {};
    } catch (err) {
      throw parseApiError(err);
    }
  },
};

export default paymentService;
