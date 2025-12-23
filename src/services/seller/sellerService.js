import { fetcher } from "@/lib/fetcher";

export const sellerService = {
  async fetchProducts(sellerId, limit = 6, page = 1) {
    const res = await fetcher.get("/api/v1/products", {
      params: {
        seller_id: sellerId,
        per_page: limit,
        page,
        sort_by: "created_at",
        sort_dir: "desc",
      },
    });
    if (res?.products) {
      return {
        products: res.products,
        totalProducts: res.totalProducts ?? 0,
        totalPages: res.totalPages ?? 1,
        currentPage: res.currentPage ?? page,
      };
    }
    const payload = res?.data;
    if (payload?.data && Array.isArray(payload.data)) {
      return {
        products: payload.data,
        totalProducts: payload.total ?? 0,
        totalPages: payload.last_page ?? 1,
        currentPage: payload.current_page ?? page,
      };
    }
    const list = Array.isArray(payload) ? payload : [];
    return {
      products: list,
      totalProducts: list.length,
      totalPages: 1,
      currentPage: page,
    };
  },
  async deleteProduct(productId) {
    try {
      await fetcher.delete(`/api/v1/products/${productId}`);
      return true;
    } catch {
      return false;
    }
  },
};
export default sellerService;
