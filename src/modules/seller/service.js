// Seller Dashboard API Services

const fetchSellerStats = async (sellerId, period = 'daily') => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seller/${sellerId}/stats?period=${period}`
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error fetching seller stats:', err);
    return null;
  }
};

const fetchSellerOrders = async (sellerId, status = 'all', limit = 10) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seller/${sellerId}/orders?status=${status}&limit=${limit}`
    );
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    return [];
  }
};

const fetchSellerProducts = async (sellerId, limit = 6) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seller/${sellerId}/products?limit=${limit}`
    );
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    console.error('Error fetching seller products:', err);
    return [];
  }
};

const verifyOrder = async (orderId, sellerId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seller/${sellerId}/orders/${orderId}/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      }
    );
    const data = await res.json();
    return data.success || false;
  } catch (err) {
    console.error('Error verifying order:', err);
    return false;
  }
};

const updateProduct = async (productId, sellerId, payload) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seller/${sellerId}/products/${productId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error('Error updating product:', err);
    return null;
  }
};

const deleteProduct = async (productId, sellerId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seller/${sellerId}/products/${productId}`,
      { method: 'DELETE' }
    );
    return res.ok;
  } catch (err) {
    console.error('Error deleting product:', err);
    return false;
  }
};

export {
  fetchSellerStats,
  fetchSellerOrders,
  fetchSellerProducts,
  verifyOrder,
  updateProduct,
  deleteProduct
};