import { useState, useEffect } from 'react';
import apiClient from '@/services/api/client';
import { formatCurrency } from '@/utils/formatters/currency';
import { transformIncomeData } from '@/utils/helpers/incomeHelper';

/**
 * Hook to fetch and manage seller income data with chart
 * @param {number|null} sellerId - Seller ID
 */
export const useSellerIncome = (sellerId) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [incomeData, setIncomeData] = useState({
    balance: 0,
    transferred: 0,
    chartData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sellerId) {
      setIsLoading(false);
      return;
    }

    const fetchIncomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching income data for seller:', sellerId, 'period:', selectedPeriod);

        const response = await apiClient.get('/api/v1/transactions', {
          params: {
            period: selectedPeriod,
            seller_id: sellerId
          },
          timeout: 30000,
        });

        console.log('Income API Response:', response.data);

        const rawTransactions = response.data?.data;

        if (Array.isArray(rawTransactions)) {
          // Transform raw transactions to income data
          const transformedData = transformIncomeData(rawTransactions, selectedPeriod);

          console.log('Transformed Income Data:', transformedData);

          setIncomeData(transformedData);
        } else if (rawTransactions && rawTransactions.chart_data) {
          // Fallback: API already returns aggregated data (future API update)
          const formattedChartData = (rawTransactions.chart_data || []).map((item) => ({
            label: item.label,
            income: item.income,
          }));

          setIncomeData({
            balance: rawTransactions.balance || 0,
            transferred: rawTransactions.transferred || 0,
            chartData: formattedChartData,
          });
        } else {
          console.warn('Unexpected data format:', rawTransactions);
          setIncomeData({
            balance: 0,
            transferred: 0,
            chartData: [],
          });
        }
      } catch (err) {
        console.error('Error fetching income data:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        let errorMessage = 'Failed to load income data';

        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err.response?.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (err.response?.status === 403) {
          errorMessage = 'Access denied. You do not have permission to view this data.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Income data not found for this seller.';
        } else if (err.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);

        // Set empty data on error
        setIncomeData({
          balance: 0,
          transferred: 0,
          chartData: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncomeData();
  }, [sellerId, selectedPeriod]);

  const getYAxisDomain = () => {
    if (incomeData.chartData.length === 0) return [0, 10000];

    const maxIncome = Math.max(...incomeData.chartData.map((d) => d.income), 0);
    const minIncome = Math.min(...incomeData.chartData.map((d) => d.income), 0);
    const padding = Math.max(maxIncome * 0.2, 1000);
    const max = Math.ceil((maxIncome + padding) / 1000) * 1000;
    const min = Math.max(0, Math.floor((minIncome - padding) / 1000) * 1000);

    return [min, max];
  };

  const getYAxisTicks = () => {
    const [yMin, yMax] = getYAxisDomain();
    const yTicks = [];
    const step = (yMax - yMin) / 4;

    for (let i = yMin; i <= yMax; i += step) {
      yTicks.push(Math.round(i));
    }

    return yTicks;
  };

  const getMinDataPoint = () => {
    if (incomeData.chartData.length === 0) return null;
    return incomeData.chartData.reduce(
      (min, item) => (item.income < min.income ? item : min),
      incomeData.chartData[0]
    );
  };

  return {
    ...incomeData,
    selectedPeriod,
    setSelectedPeriod,
    isLoading,
    error,
    formatCurrency,
    getYAxisDomain,
    getYAxisTicks,
    getMinDataPoint,
  };
};
