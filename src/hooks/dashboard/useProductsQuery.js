import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryClient';

/**
 * Fetch products with caching
 * Uses React Query for automatic caching & refetching
 */
const fetchProducts = async ({ queryKey }) => {
  const [_, params] = queryKey;
  const response = await api.get('/api/v1/products', { params });
  return response.data;
};

/**
 * Hook to fetch products with caching and pagination
 * @param {Object} params - Query parameters (page, per_page, category, q, etc.)
 * @returns {Object} { data, isLoading, error, refetch }
 */
export const useProductsQuery = (params = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeys.products, params],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    keepPreviousData: true, // Keep displaying previous page data while new one loads
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const defaultData = { products: [], totalProducts: 0, totalPages: 1, currentPage: 1 };
  const finalData = data || defaultData;

  return {
    data: finalData,
    products: finalData.products, // Backward compatibility
    isLoading,
    error,
    refetch,
  };
};
