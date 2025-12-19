import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryClient';

/**
 * Fetch products with caching
 * Uses React Query for automatic caching & refetching
 */
const fetchProducts = async () => {
  const response = await api.get('/api/v1/products');
  return response.data?.data || [];
};

/**
 * Hook to fetch products with caching
 * @returns {Object} { products, isLoading, error, refetch }
 */
export const useProductsQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 2, // Retry 2 times on failure
  });

  return {
    products: data || [],
    isLoading,
    error,
    refetch,
  };
};
