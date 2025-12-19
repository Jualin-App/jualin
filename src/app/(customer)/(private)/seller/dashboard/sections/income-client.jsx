"use client";
import React, { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceDot } from "recharts";

const chartData = [
  { month: "March", income: 5800 },
  { month: "April", income: 5500 },
  { month: "May", income: 4500 },
  { month: "June", income: 7500 },
  { month: "July", income: 6000 },
  { month: "August", income: 5800 },
];

const IncomeSectionClient = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Month");

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Income</h2>
      <div className="rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-200">
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-2xl font-bold text-brand-red">Rp 12.000</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Transferred</p>
              <p className="text-2xl font-bold text-brand-red">Rp 12.000</p>
            </div>
          </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 20, left: 8, bottom: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} domain={[2000, 10000]} ticks={[2000, 4000, 6000, 8000, 10000]} />
            <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: "8px" }} formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Income"]} />
            <Line type="monotone" dataKey="income" stroke="#ef4444" strokeWidth={2} dot={false} />
            <ReferenceDot x="May" y={4500} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

          <div className="flex mt-6 bg-gray-100 rounded-xl p-1">
            {["Year", "Month", "Week"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  selectedPeriod === p ? "bg-brand-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
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
