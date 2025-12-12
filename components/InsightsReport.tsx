import React from 'react';
import { BatchAnalysisResult } from '../types';
import { Sparkles, TrendingUp, Layers, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InsightsReportProps {
  insights: BatchAnalysisResult | null;
  isLoading: boolean;
  onClose: () => void;
  onGenerate: () => void;
  hasData: boolean;
}

export const InsightsReport: React.FC<InsightsReportProps> = ({ insights, isLoading, onClose, onGenerate, hasData }) => {
  if (!hasData) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">AI Deep Insights</h2>
            <p className="text-xs text-slate-500">Trend analysis & recurring themes</p>
          </div>
        </div>
        {insights ? (
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
               <X className="w-5 h-5" />
             </button>
        ) : (
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating Report...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Generate Report
                    </>
                )}
            </button>
        )}
      </div>

      {insights && (
        <div className="p-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Sentiment Trend Section */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800">Sentiment Trends</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {insights.sentiment_trend_analysis}
              </p>
            </div>

            {/* Recurring Themes Section */}
            <div className="bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-800">Recurring Themes</h3>
              </div>
              
              <div className="h-48 mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights.top_themes} layout="vertical" margin={{ left: 0 }}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="theme_name" type="category" width={100} tick={{fontSize: 11}} interval={0} />
                       <Tooltip 
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                         cursor={{fill: '#f1f5f9'}}
                       />
                       <Bar dataKey="count" barSize={20} radius={[0, 4, 4, 0]}>
                          {insights.top_themes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${250 + (index * 20)}, 70%, 60%)`} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {insights.top_themes.map((theme, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {theme.count}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900">{theme.theme_name}</h4>
                        <p className="text-xs text-slate-500">{theme.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};