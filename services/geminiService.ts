import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, FeedbackItem, BatchAnalysisResult } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

export const analyzeFeedback = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Analyze the following customer feedback ticket or review. 
      Extract the sentiment, identify the core pain point, suggest a feature request or solution based on the text, and assign a priority level for the product team.
      
      Also, generate relevant tags (3-5) based on the extracted pain_point and feature_request.
      For example:
      - Pain point: 'app crashing on login' -> tags: ['login issue', 'bug', 'crashing']
      - Feature request: 'add dark mode' -> tags: ['UI request', 'dark mode', 'enhancement']
      
      Feedback: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: ["Positive", "Neutral", "Negative"],
              description: "The overall sentiment of the feedback."
            },
            pain_point: {
              type: Type.STRING,
              description: "A concise summary of the specific problem or issue the customer is facing."
            },
            feature_request: {
              type: Type.STRING,
              description: "A suggested feature or solution derived from the feedback."
            },
            priority: {
              type: Type.STRING,
              enum: ["Low", "Medium", "High"],
              description: "The urgency of addressing this issue based on severity and sentiment."
            },
            summary: {
              type: Type.STRING,
              description: "A very short one-sentence summary of the feedback."
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-5 keywords describing the issue and request."
            }
          },
          required: ["sentiment", "pain_point", "feature_request", "priority", "summary", "tags"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response text received from Gemini.");
    }

    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    throw error;
  }
};

export const generateBatchInsights = async (items: FeedbackItem[]): Promise<BatchAnalysisResult> => {
  try {
    // Minimize data payload to save tokens and focus on relevant fields
    const minimizedItems = items.map(item => ({
      date: new Date(item.timestamp).toISOString().split('T')[0],
      sentiment: item.sentiment,
      pain_point: item.pain_point,
      feature_request: item.feature_request,
      tags: item.tags || []
    }));

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Analyze the following list of customer feedback data.
      1. Analyze the 'sentiment' field over time. Identify trends (improving, declining, stable) and highlight any shifts.
      2. Identify recurring themes in 'pain_point' and 'feature_request'. Group similar issues and count them.
      
      Data: ${JSON.stringify(minimizedItems)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment_trend_analysis: {
              type: Type.STRING,
              description: "A paragraph describing the sentiment trend over time, noting any shifts."
            },
            top_themes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  theme_name: { type: Type.STRING },
                  count: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["theme_name", "count", "description"]
              },
              description: "List of recurring themes found in the feedback."
            }
          },
          required: ["sentiment_trend_analysis", "top_themes"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");
    
    return JSON.parse(jsonText) as BatchAnalysisResult;
  } catch (error) {
    console.error("Error generating batch insights:", error);
    throw error;
  }
};
