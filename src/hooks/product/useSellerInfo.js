import { useEffect } from 'react';
import { useAsync } from '../common/useAsync';
import { userService } from '@/services/user/userService';

/**
 * Hook to fetch seller information by seller ID
 * @param {number|null} sellerId - Seller ID
 */
export const useSellerInfo = (sellerId) => {
  const {
    data: seller,
    loading,
    error,
    execute,
  } = useAsync(
    () => (sellerId ? userService.fetchById(sellerId) : Promise.resolve(null)),
    {
      immediate: false,
      initialData: null,
    }
  );

  useEffect(() => {
    if (sellerId) {
      execute();
    }
  }, [sellerId]);

  return {
    seller,
    isLoading: loading,
    error,
    refetch: execute,
  };
};
