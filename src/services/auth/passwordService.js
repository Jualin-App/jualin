import apiClient from "../api/client";
import { parseApiError } from "../api/errorHandler";

export const passwordService = {
  async sendResetLink(email) {
    try {
      // bump timeout for slower mail providers
      const res = await apiClient.post(
        "/api/v1/password/email",
        { email },
        { timeout: 30000 }
      );
      return res.data;
    } catch (err) {
      // Special-case timeout: show a friendly hint
      if (err.code === "ECONNABORTED") {
        throw new Error(
          "Request timeout. If email arrives, please check your inbox."
        );
      }
      throw parseApiError(err);
    }
  },

  async resetPassword({ token, email, password, password_confirmation }) {
    try {
      const res = await apiClient.post(
        "/api/v1/password/reset",
        { token, email, password, password_confirmation },
        { timeout: 30000 }
      );
      return res.data;
    } catch (err) {
      throw parseApiError(err);
    }
  },
};

export default passwordService;
