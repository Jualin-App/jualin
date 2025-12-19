import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api/client';
import { queryKeys } from '@/lib/queryClient';
import { transformIncomeData } from '@/utils/helpers/incomeHelper';
import { formatCurrency } from '@/utils/formatters/currency';

/**
 * Fetch seller income data with caching
 */
const fetchSellerIncome = async ({ sellerId, period }) => {
  if (!sellerId) {
    throw new Error('Seller ID is required');
  }

  const response = await apiClient.get('/api/v1/transactions', {
    params: {
      period,
      seller_id: sellerId,
    },
    timeout: 30000,
  });

  const rawTransactions = response.data?.data;

  if (Array.isArray(rawTransactions)) {
    return transformIncomeData(rawTransactions, period);
  } else if (rawTransactions && rawTransactions.chart_data) {
    // Fallback: API already returns aggregated data
    const formattedChartData = (rawTransactions.chart_data || []).map((item) => ({
      label: item.label,
      income: item.income,
    }));

    return {
      balance: rawTransactions.balance || 0,
      transferred: rawTransactions.transferred || 0,
      chartData: formattedChartData,
    };
  }

  return {
    balance: 0,
    transferred: 0,
    chartData: [],
  };
};

/**
 * Hook to fetch seller income with caching
 */
export const useSellerIncomeQuery = (sellerId, period = 'Month') => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.sellerIncome(sellerId, period),
    queryFn: () => fetchSellerIncome({ sellerId, period }),
    enabled: !!sellerId, // Only fetch when sellerId exists
    staleTime: 2 * 60 * 1000, // 2 minutes - income data changes more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 1,
  });

  // Y-axis domain calculation
  const getYAxisDomain = () => {
    if (!data?.chartData || data.chartData.length === 0) return [0, 10000];

    const maxIncome = Math.max(...data.chartData.map((d) => d.income), 0);
    const minIncome = Math.min(...data.chartData.map((d) => d.income), 0);
    const padding = Math.max(maxIncome * 0.2, 1000);
    const max = Math.ceil((maxIncome + padding) / 1000) * 1000;
    const min = Math.max(0, Math.floor((minIncome - padding) / 1000) * 1000);

    return [min, max];
  };

  // Y-axis ticks
  const getYAxisTicks = () => {
    const [yMin, yMax] = getYAxisDomain();
    const yTicks = [];
    const step = (yMax - yMin) / 4;

    for (let i = yMin; i <= yMax; i += step) {
      yTicks.push(Math.round(i));
    }

    return yTicks;
  };

  // Min data point for ReferenceDot
  const getMinDataPoint = () => {
    if (!data?.chartData || data.chartData.length === 0) return null;
    return data.chartData.reduce(
      (min, item) => (item.income < min.income ? item : min),
      data.chartData[0]
    );
  };

  return {
    balance: data?.balance || 0,
    transferred: data?.transferred || 0,
    chartData: data?.chartData || [],
    isLoading,
    error,
    refetch,
    formatCurrency,
    getYAxisDomain,
    getYAxisTicks,
    getMinDataPoint,
  };
};
