import { fetch as baseFetch } from '@/utils/baseFetch';

export const productService = {
  list: async (params) => {
    const payload = params ? { params } : undefined;
    const res = await baseFetch({ url: 'http://127.0.0.1:8000/api/v1/products', method: 'GET', payload });
    return res;
  },
};

export default productService;