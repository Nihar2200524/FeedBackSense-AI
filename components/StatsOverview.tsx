import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { FeedbackItem, Sentiment, Priority } from '../types';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  items: FeedbackItem[];
}

const COLORS = {
  Positive: '#10b981', // emerald-500
  Neutral: '#64748b',  // slate-500
  Negative: '#ef4444', // red-500
};

const PRIORITY_COLORS = {
  Low: '#3b82f6',    // blue-500
  Medium: '#f59e0b', // amber-500
  High: '#ef4444',   // red-500
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({ items }) => {
  const stats = useMemo(() => {
    const sentimentCounts = items.reduce((acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityCounts = items.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = items.length;
    const highPriority = priorityCounts[Priority.High] || 0;
    const negativeSentiment = sentimentCounts[Sentiment.Negative] || 0;

    return {
      sentimentData: Object.entries(sentimentCounts).map(([name, value]) => ({ name, value })),
      priorityData: [
        { name: 'Low', value: priorityCounts[Priority.Low] || 0 },
        { name: 'Medium', value: priorityCounts[Priority.Medium] || 0 },
        { name: 'High', value: priorityCounts[Priority.High] || 0 },
      ],
      total,
      highPriority,
      negativeSentiment
    };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 opacity-50 pointer-events-none grayscale">
         {/* Placeholder skeleton if no data */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-32 animate-pulse"></div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-32 animate-pulse"></div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-32 animate-pulse"></div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-32 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Feedback</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">High Priority</p>
            <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Negative Sentiment</p>
            <p className="text-3xl font-bold text-slate-900">{stats.negativeSentiment}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-full">
            <TrendingUp className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Actionable Items</p>
            <p className="text-3xl font-bold text-slate-900">{Math.round((stats.total * 0.8))} <span className="text-xs text-slate-400 font-normal">est.</span></p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Sentiment Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#ccc'} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {Object.entries(COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-xs text-slate-600">{key}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Priority Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                 <RechartsTooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]}>
                    {stats.priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || '#ccc'} />
                    ))}
                 </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
