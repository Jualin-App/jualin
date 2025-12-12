// Seller Dashboard API Services
// Menggunakan instance axios `api` agar otomatis menyertakan baseURL + Authorization header
import api from "@/lib/axios";

// Sementara: hitung statistik income di FE dari list transaksi seller
const fetchSellerStats = async (sellerId, period = "daily") => {
  try {
    const orders = await fetchSellerOrders(sellerId, "all", 100);

    const totalIncome = orders.reduce(
      (sum, trx) => sum + (Number(trx.total_amount) || 0),
      0
    );

    return {
      period,
      totalIncome,
    };
  } catch (err) {
    console.error("Error computing seller stats:", err);
    return null;
  }
};

// Ambil transaksi yang terkait dengan user yang sedang login (seller/customer)
const fetchSellerOrders = async (_sellerId, _status = "all", limit = 10) => {
  try {
    const response = await api.get("/api/v1/transactions", {
      params: {
        per_page: limit,
      },
    });

    const payload = response.data?.data;

    // Laravel paginator: { data: [...], current_page, ... }
    if (payload && Array.isArray(payload.data)) {
      return payload.data;
    }

    // Fallback jika backend mengembalikan array langsung
    if (Array.isArray(payload)) {
      return payload;
    }

    return [];
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    return [];
  }
};

// Ambil produk milik seller (backend akan kita lengkapi dengan filter seller_id)
const fetchSellerProducts = async (sellerId, limit = 6) => {
  try {
    const response = await api.get("/api/v1/products", {
      params: {
        seller_id: sellerId,
        per_page: limit,
        sort_by: "created_at",
        sort_dir: "desc",
      },
    });

    const payload = response.data?.data;

    if (payload && Array.isArray(payload.data)) {
      return payload.data;
    }

    if (Array.isArray(payload)) {
      return payload;
    }

    return [];
  } catch (err) {
    console.error("Error fetching seller products:", err);
    return [];
  }
};

const verifyOrder = async (orderId) => {
  try {
    // Catatan: backend belum punya endpoint khusus verifikasi,
    // endpoint ini disiapkan untuk ketika fitur tersedia.
    const response = await api.post(`/api/v1/transactions/${orderId}`, {
      status: "verified",
    });

    return !!response.data?.success;
  } catch (err) {
    console.error("Error verifying order:", err);
    return false;
  }
};

const updateProduct = async (productId, _sellerId, payload) => {
  try {
    const response = await api.put(`/api/v1/products/${productId}`, payload);
    return response.data?.data ?? null;
  } catch (err) {
    console.error("Error updating product:", err);
    return null;
  }
};

const deleteProduct = async (productId, _sellerId) => {
  try {
    const response = await api.delete(`/api/v1/products/${productId}`);
    return response.status === 200 || response.status === 204;
  } catch (err) {
    console.error("Error deleting product:", err);
    return false;
  }
};

export {
  fetchSellerStats,
  fetchSellerOrders,
  fetchSellerProducts,
  verifyOrder,
  updateProduct,
  deleteProduct,
};