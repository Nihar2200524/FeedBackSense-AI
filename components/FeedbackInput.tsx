import React, { useState } from 'react';
import { Loader2, Plus, Wand2 } from 'lucide-react';

interface FeedbackInputProps {
  onAnalyze: (text: string, source: string) => Promise<void>;
  isAnalyzing: boolean;
}

const SAMPLE_FEEDBACKS = [
  "I love the new update! The interface is much cleaner, but I'm struggling to find the export button now. Can you make it more visible?",
  "This app crashes every time I try to upload a photo larger than 5MB. It's incredibly frustrating and I might cancel my subscription if not fixed.",
  "The customer support team was helpful, but the billing process is too confusing. Why are there so many hidden fees?",
  "Great potential, but it loads very slowly on my Android device. Please optimize for mobile performance."
];

export const FeedbackInput: React.FC<FeedbackInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [source, setSource] = useState('Manual Entry');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onAnalyze(text, source);
    setText('');
  };

  const loadSample = () => {
    const random = SAMPLE_FEEDBACKS[Math.floor(Math.random() * SAMPLE_FEEDBACKS.length)];
    setText(random);
    setSource('Simulated Ticket');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          Analyze New Feedback
        </h2>
        <button
          onClick={loadSample}
          type="button"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-3 py-1.5 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
        >
          <Wand2 className="w-3 h-3" />
          Autofill Sample
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-slate-700 mb-1">
            Source
          </label>
          <select
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="Manual Entry">Manual Entry</option>
            <option value="Zendesk">Zendesk Ticket</option>
            <option value="App Store">App Store Review</option>
            <option value="Play Store">Play Store Review</option>
            <option value="Email">Email</option>
            <option value="Social Media">Social Media</option>
            <option value="Simulated Ticket">Simulated Ticket</option>
          </select>
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-1">
            Feedback Text
          </label>
          <textarea
            id="feedback"
            rows={5}
            className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Paste customer review or support ticket content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !text.trim()}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white font-medium transition-all ${
            isAnalyzing || !text.trim()
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600 shadow-md hover:shadow-lg'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing with Gemini...
            </>
          ) : (
            'Analyze Feedback'
          )}
        </button>
      </form>
    </div>
  );
};