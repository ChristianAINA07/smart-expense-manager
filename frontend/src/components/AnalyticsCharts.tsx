import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#eab308', '#a855f7', '#64748b'];

export default function AnalyticsCharts({ stats }: { stats: any }) {
  const hasPieData = stats?.pieData && stats.pieData.length > 0;

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* 1. Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider">Evolution Annuelle</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.barData || []}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none' }} />
              <Legend />
              <Bar dataKey="Revenus" fill="#10b981" />
              <Bar dataKey="Depenses" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Pie Chart */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider">Repartition des Depenses</h3>
        <div className="h-64 flex items-center justify-center">
          {hasPieData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-sm">Aucune depense enregistree.</p>
          )}
        </div>
      </div>
    </div>
  );
}
