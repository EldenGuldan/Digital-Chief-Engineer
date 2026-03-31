
import { GoogleGenAI, Type } from "@google/genai";

// Helper to obtain a fresh client instance following SDK guidelines
const getAIClient = () => {
  // Always use a named parameter for the API key
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateStructuredAIContent = async (prompt: string, systemInstruction: string = ""): Promise<{answer: string, citations: any[]}> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex reasoning and structured JSON output
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: `${systemInstruction} 请务必以 JSON 格式回复。`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: "主回答文本，需在文中适当位置插入如 [1], [2] 的引用标注。"
            },
            citations: {
              type: Type.ARRAY,
              description: "引用文献列表",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "引用编号，如 1" },
                  sourceTitle: { type: Type.STRING, description: "文献/规范名称" },
                  snippet: { type: Type.STRING, description: "被引用的原文核心片段" },
                  location: { type: Type.STRING, description: "具体章节或条款号" }
                },
                required: ["id", "sourceTitle", "snippet"]
              }
            }
          },
          required: ["answer", "citations"]
        }
      },
    });

    // Accessing response.text property directly (not a method)
    const result = JSON.parse(response.text || "{}");
    return {
      answer: result.answer || "未能生成有效回答。",
      citations: result.citations || []
    };
  } catch (error) {
    console.error("Gemini API Call Failed:", error);
    return {
      answer: "服务异常，请稍后再试。",
      citations: []
    };
  }
};

// 保留原有的非结构化调用用于简单的总结
export const generateAIContent = async (prompt: string, systemInstruction: string = ""): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      // Using gemini-3-flash-preview for basic text tasks like summarization
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Accessing response.text property directly
    return response.text || "抱歉，无法生成回答。";
  } catch (error) {
    console.error("Gemini API Call Failed:", error);
    return "网络连接异常。";
  }
};
