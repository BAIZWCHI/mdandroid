import { GoogleGenAI, Chat } from '@google/genai';

// Initialize the Google Gen AI SDK.
// Note: As per strict system instructions, the API key MUST be obtained exclusively from process.env.API_KEY.
// We do not provide a UI for the user to configure this.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: '你是一个集成在 Markdown 编辑器中的得力 AI 助手。你的任务是帮助用户撰写、润色、排版 Markdown 内容，或者提供灵感。请尽量使用 Markdown 格式回复，以便用户可以直接复制或插入到他们的文档中。',
    },
  });
};
