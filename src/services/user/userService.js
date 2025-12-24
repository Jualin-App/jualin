import { fetcher } from "@/lib/fetcher";

export const userService = {
  async fetchById(id) {
    const response = await fetcher.get(`/api/v1/users/${id}`);
    return response?.data || response;
  },

  async fetchCurrentUser() {
    const response = await fetcher.get("/api/v1/users/me");
    return response?.data || response;
  },
};

export default userService;
