import React from 'react';
import { FeedbackItem, Priority, Sentiment } from '../types';
import { AlertCircle, CheckCircle2, MinusCircle, ArrowRight, Trash2, Tag } from 'lucide-react';

interface FeedbackListProps {
  items: FeedbackItem[];
  onDelete: (id: string) => void;
}

const SentimentIcon = ({ sentiment }: { sentiment: Sentiment }) => {
  switch (sentiment) {
    case Sentiment.Positive:
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case Sentiment.Negative:
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <MinusCircle className="w-5 h-5 text-slate-500" />;
  }
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    [Priority.High]: 'bg-red-100 text-red-700 border-red-200',
    [Priority.Medium]: 'bg-amber-100 text-amber-700 border-amber-200',
    [Priority.Low]: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

export const FeedbackList: React.FC<FeedbackListProps> = ({ items, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
          <MinusCircle className="w-6 h-6 text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-medium mb-1">No feedback analyzed yet</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Enter customer feedback in the panel to the right to generate structured insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Recent Analysis</h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  item.sentiment === Sentiment.Negative ? 'bg-red-50' : 
                  item.sentiment === Sentiment.Positive ? 'bg-emerald-50' : 'bg-slate-50'
                }`}>
                  <SentimentIcon sentiment={item.sentiment} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{item.summary}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-600">{item.source}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={item.priority} />
                <button 
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Pain Point</span>
                <p className="text-sm text-slate-800 font-medium">{item.pain_point}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block mb-1">Recommended Feature</span>
                <div className="flex items-start gap-1.5">
                   <ArrowRight className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                   <p className="text-sm text-indigo-900 font-medium">{item.feature_request}</p>
                </div>
              </div>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 italic">"{item.originalText}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
