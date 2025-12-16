import { useState, useEffect } from 'react';
import apiClient from '@/services/api/client';
import { formatCurrency } from '@/utils/formatters/currency';

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
    if (!sellerId) return;

    const fetchIncomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get('/api/v1/transactions', {
          params: { period: selectedPeriod },
          timeout: 30000,
        });

        const data = response.data?.data;

        if (data) {
          const formattedChartData = (data.chart_data || []).map((item) => ({
            label: item.label,
            income: item.income,
          }));

          setIncomeData({
            balance: data.balance || 0,
            transferred: data.transferred || 0,
            chartData: formattedChartData,
          });
        }
      } catch (err) {
        console.error('Error fetching income data:', err);

        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          setError('Request timed out. Please try again.');
        } else {
          setError('Failed to load income data');
        }

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
