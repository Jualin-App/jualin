import apiClient from '../api/client';
import { parseApiError } from '../api/errorHandler';

const normalizeProduct = (product) => ({
  ...product,
  img: product.image,
  id: product.id,
  category: product.category?.toLowerCase() || '',
  brand: product.brand || '',
  price: product.price,
  name: product.name,
  description: product.description,
  image: product.image,
  seller_id: product.seller_id,
  created_at: product.created_at,
  updated_at: product.updated_at,
});

export const productService = {
  async fetchAll(async) {
    try {
      const response = await apiClient.get('/api/v1/products');
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      return data.map(normalizeProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw parseApiError(error);
    }
  },

  async fetchById(id) {
    try {
      const response = await apiClient.get(`/api/v1/products/${id}`);
      return normalizeProduct(response.data.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw parseApiError(error);
    }
  },

  async create(productData, imageFile = null) {
    try {
      // Get seller ID from localStorage
      const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

      console.log('🔍 Stored user:', storedUser);

      const sellerId = storedUser?.id || storedUser?.user_id || storedUser?.userId;

      console.log('🔍 Seller ID:', sellerId);

      if (!sellerId) {
        console.error('❌ User object:', storedUser);
        throw new Error('Seller ID not found. Please login again.');
      }

      let response;

      if (imageFile) {
        // With image upload - use FormData
        const formData = new FormData();
        formData.append('seller_id', sellerId);
        formData.append('name', productData.name);
        formData.append('description', productData.description || '');
        formData.append('price', productData.price);
        formData.append('stock_quantity', productData.stock_quantity || 0);
        formData.append('category', productData.category || '');
        formData.append('condition', productData.condition || 'new');
        formData.append('status', productData.status || 'active');
        formData.append('image', imageFile);

        response = await apiClient.post('/api/v1/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Without image - use JSON
        response = await apiClient.post('/api/v1/products', {
          seller_id: sellerId,
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          stock_quantity: productData.stock_quantity || 0,
          category: productData.category || '',
          condition: productData.condition || 'new',
          status: productData.status || 'active',
        });
      }

      return normalizeProduct(response.data.data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw parseApiError(error);
    }
  },

  async update(id, productData, imageFile = null) {
    try {
      let response;

      if (imageFile) {
        // With image upload - use FormData with POST method
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description || '');
        formData.append('price', productData.price);
        formData.append('stock_quantity', productData.stock_quantity || 0);
        formData.append('category', productData.category || '');
        formData.append('condition', productData.condition || 'new');
        formData.append('status', productData.status || 'active');
        formData.append('image', imageFile);

        response = await apiClient.post(`/api/v1/products/${id}?_method=PATCH`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Without image - use PATCH
        response = await apiClient.patch(`/api/v1/products/${id}`, {
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          stock_quantity: productData.stock_quantity || 0,
          category: productData.category || '',
          condition: productData.condition || 'new',
          status: productData.status || 'active',
        });
      }

      return normalizeProduct(response.data.data);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw parseApiError(error);
    }
  },

  async delete(id) {
    try {
      await apiClient.delete(`/api/v1/products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return false;
    }
  },
};

export default productService;
