"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceDot } from "recharts";
import api from "@/lib/axios";

const IncomeSectionClient = ({ sellerId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  const [balance, setBalance] = useState(0);
  const [transferred, setTransferred] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncomeData = async (period) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/api/v1/transactions/income/statistics", {
        params: { period },
        timeout: 30000, // 30 seconds timeout for this request
      });

      const data = response.data?.data;
      if (data) {
        setBalance(data.balance || 0);
        setTransferred(data.transferred || 0);
        
        // Transform chart data to match the expected format
        const formattedChartData = (data.chart_data || []).map((item) => ({
          label: item.label,
          income: item.income,
        }));
        setChartData(formattedChartData);
      }
    } catch (err) {
      console.error("Error fetching income data:", err);
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError("Request timed out. Please try again or contact support if the issue persists.");
      } else {
        setError("Failed to load income data");
      }
      setChartData([]);
      setBalance(0);
      setTransferred(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchIncomeData(selectedPeriod);
    }
  }, [sellerId, selectedPeriod]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Calculate dynamic Y-axis domain based on data
  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 10000];
    const maxIncome = Math.max(...chartData.map((d) => d.income), 0);
    const minIncome = Math.min(...chartData.map((d) => d.income), 0);
    const padding = Math.max(maxIncome * 0.2, 1000);
    const max = Math.ceil((maxIncome + padding) / 1000) * 1000;
    const min = Math.max(0, Math.floor((minIncome - padding) / 1000) * 1000);
    return [min, max];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const [yMin, yMax] = getYAxisDomain();
  const yTicks = [];
  const step = (yMax - yMin) / 4;
  for (let i = yMin; i <= yMax; i += step) {
    yTicks.push(Math.round(i));
  }

  // Find the data point with minimum income for ReferenceDot
  const minDataPoint = chartData.length > 0 
    ? chartData.reduce((min, item) => (item.income < min.income ? item : min), chartData[0])
    : null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Income</h2>
      <div className="rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-200">
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              {isLoading ? (
                <p className="text-2xl font-bold text-brand-red">Loading...</p>
              ) : (
                <p className="text-2xl font-bold text-brand-red">{formatCurrency(balance)}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Transferred</p>
              {isLoading ? (
                <p className="text-2xl font-bold text-brand-red">Loading...</p>
              ) : (
                <p className="text-2xl font-bold text-brand-red">{formatCurrency(transferred)}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="h-64">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No income data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 12, right: 20, left: 8, bottom: 0 }}>
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#888", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#888", fontSize: 12 }} 
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} 
                    domain={[yMin, yMax]} 
                    ticks={yTicks}
                  />
                  <Tooltip 
                    contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: "8px" }} 
                    formatter={(value) => [formatCurrency(value), "Income"]} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  {minDataPoint && (
                    <ReferenceDot 
                      x={minDataPoint.label} 
                      y={minDataPoint.income} 
                      r={6} 
                      fill="#ef4444" 
                      stroke="white" 
                      strokeWidth={2} 
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex mt-6 bg-gray-100 rounded-xl p-1">
            {["Year", "Month", "Week"].map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                disabled={isLoading}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedPeriod === p 
                    ? "bg-brand-red text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncomeSectionClient;
