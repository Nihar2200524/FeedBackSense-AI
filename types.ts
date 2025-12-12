export enum Sentiment {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative'
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface AnalysisResult {
  sentiment: Sentiment;
  pain_point: string;
  feature_request: string;
  priority: Priority;
  summary: string;
  tags: string[];
}

export interface FeedbackItem extends AnalysisResult {
  id: string;
  originalText: string;
  timestamp: number;
  source: string; // e.g., "Manual Entry", "Zendesk", "App Store"
}

export interface ThemeGroup {
  theme_name: string;
  count: number;
  description: string;
}

export interface BatchAnalysisResult {
  sentiment_trend_analysis: string;
  top_themes: ThemeGroup[];
}
