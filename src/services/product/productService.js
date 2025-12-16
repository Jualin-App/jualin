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

  async create(payload) {
    try {
      const response = await apiClient.post('/api/v1/products', payload);
      return normalizeProduct(response.data.data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw parseApiError(error);
    }
  },

  async update(id, payload) {
    try {
      const response = await apiClient.put(`/api/v1/products/${id}`, payload);
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
