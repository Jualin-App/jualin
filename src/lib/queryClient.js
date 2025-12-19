import { QueryClient } from '@tanstack/react-query';

/**
 * Query Client Configuration
 * Centralized cache & data fetching configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data dianggap fresh selama 5 menit
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: Data disimpan di cache selama 10 menit
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Refetch on window focus (user kembali ke tab)
      refetchOnWindowFocus: true,

      // Refetch on reconnect (internet kembali)
      refetchOnReconnect: true,

      // Retry failed requests
      retry: 1,

      // Refetch interval (optional, set to false for manual control)
      refetchInterval: false,

      // Show cached data while fetching new data (stale-while-revalidate)
      refetchOnMount: 'always',
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
});

/**
 * Query Keys
 * Centralized query key management untuk consistency
 */
export const queryKeys = {
  // Products
  products: ['products'],
  productDetail: (id) => ['products', 'detail', id],
  productsByCategory: (category) => ['products', 'category', category],

  // Seller
  sellerProducts: (sellerId) => ['seller', sellerId, 'products'],
  sellerIncome: (sellerId, period) => ['seller', sellerId, 'income', period],
  sellerOrders: (sellerId) => ['seller', sellerId, 'orders'],
  sellerDashboard: (sellerId) => ['seller', sellerId, 'dashboard'],
  sellerInfo: (sellerId) => ['seller', sellerId, 'info'],

  // Transactions
  transactions: (params) => ['transactions', params],

  // User
  user: ['user'],
  userProfile: (userId) => ['user', userId, 'profile'],
  purchaseHistory: (userId) => ['user', userId, 'purchases'],

  // Chat
  chats: ['chats'],
  chatMessages: (chatId) => ['chats', chatId, 'messages'],
};
