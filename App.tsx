import React, { useState, useEffect } from 'react';
import { FeedbackInput } from './components/FeedbackInput';
import { FeedbackList } from './components/FeedbackList';
import { StatsOverview } from './components/StatsOverview';
import { InsightsReport } from './components/InsightsReport';
import { analyzeFeedback, generateBatchInsights } from './services/geminiService';
import { FeedbackItem, BatchAnalysisResult } from './types';
import { LayoutDashboard, MessageSquareText, FileText } from 'lucide-react';

export default function App() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [batchInsights, setBatchInsights] = useState<BatchAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('feedback_items');
    if (saved) {
      try {
        setFeedbackItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
    
    // Load saved insights if available to persist state
    const savedInsights = localStorage.getItem('batch_insights');
    if (savedInsights) {
        try {
            setBatchInsights(JSON.parse(savedInsights));
        } catch(e) { console.error("Failed to parse insights", e); }
    }
  }, []);

  // Save to local storage whenever items change
  useEffect(() => {
    localStorage.setItem('feedback_items', JSON.stringify(feedbackItems));
  }, [feedbackItems]);

  useEffect(() => {
      if (batchInsights) {
          localStorage.setItem('batch_insights', JSON.stringify(batchInsights));
      } else {
          localStorage.removeItem('batch_insights');
      }
  }, [batchInsights]);

  const handleAnalyze = async (text: string, source: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFeedback(text);
      
      const newItem: FeedbackItem = {
        ...result,
        id: crypto.randomUUID(),
        originalText: text,
        timestamp: Date.now(),
        source
      };

      setFeedbackItems(prev => [newItem, ...prev]);
      // Invalidate old insights when new data comes in
      setBatchInsights(null); 
    } catch (err) {
      console.error(err);
      setError("Failed to analyze feedback. Please check your API key or try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = async () => {
    if (feedbackItems.length < 2) {
        alert("Please analyze at least 2 feedback items to generate a report.");
        return;
    }
    setIsGeneratingReport(true);
    setError(null);
    try {
        const insights = await generateBatchInsights(feedbackItems);
        setBatchInsights(insights);
    } catch (err) {
        console.error(err);
        setError("Failed to generate insights report. The model might be busy.");
    } finally {
        setIsGeneratingReport(false);
    }
  };

  const handleDelete = (id: string) => {
    setFeedbackItems(prev => prev.filter(item => item.id !== id));
    setBatchInsights(null);
  };

  const clearAll = () => {
    if(window.confirm("Are you sure you want to clear all history?")) {
        setFeedbackItems([]);
        setBatchInsights(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-slate-900 leading-none">FeedbackSense</h1>
                 <p className="text-xs text-slate-500 font-medium">AI Customer Insights</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200 hidden sm:inline-block">
                 Model: Gemini 2.5 Flash
               </span>
               {feedbackItems.length > 0 && (
                   <button onClick={clearAll} className="text-sm text-red-600 hover:text-red-800 font-medium">
                       Clear History
                   </button>
               )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-8">
             <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
             </div>
             <StatsOverview items={feedbackItems} />
        </div>

        {/* Insights Section */}
        <InsightsReport 
            insights={batchInsights} 
            isLoading={isGeneratingReport} 
            onGenerate={handleGenerateReport}
            onClose={() => setBatchInsights(null)}
            hasData={feedbackItems.length > 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
             <div className="sticky top-24">
                <FeedbackInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                
                <div className="mt-6 bg-indigo-900 rounded-xl p-6 text-white overflow-hidden relative">
                   <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-700 rounded-full opacity-50 blur-2xl"></div>
                   <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-purple-600 rounded-full opacity-50 blur-xl"></div>
                   
                   <h3 className="relative z-10 text-lg font-bold mb-2">Pro Tip</h3>
                   <p className="relative z-10 text-indigo-100 text-sm leading-relaxed">
                     Generate a Global Report to see aggregated trends and recurring themes across all your data.
                   </p>
                </div>
             </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquareText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">Feedback Stream</h2>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {feedbackItems.length}
                </span>
            </div>
            <FeedbackList items={feedbackItems} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  );
}
