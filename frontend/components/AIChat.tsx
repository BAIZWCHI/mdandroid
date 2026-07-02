import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader2, PlusCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { createChatSession } from '../services/aiService';
import type { Chat } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onAppendToEditor: (text: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, onAppendToEditor }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: '你好！我是你的 AI 写作助手。有什么我可以帮你的吗？你可以让我帮你润色文章、生成大纲，或者解答 Markdown 语法问题。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize chat session
  useEffect(() => {
    if (!chatSessionRef.current) {
      try {
        chatSessionRef.current = createChatSession();
      } catch (error) {
        console.error("Failed to initialize AI chat session:", error);
      }
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userText = input.trim();
    setInput('');
    const userMsgId = Date.now().toString();
    const modelMsgId = (Date.now() + 1).toString();

    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);
    setIsLoading(true);

    // Add an empty model message that we will stream into
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

    try {
      const responseStream = await chatSessionRef.current.sendMessageStream({ message: userText });
      
      let fullResponse = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: '抱歉，发生了一些错误，无法获取回复。请检查网络或 API 配置。' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-[400px] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex-none h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Bot size={24} />
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">AI 写作助手</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white dark:bg-gray-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-200 dark:prose-pre:bg-gray-900 prose-pre:text-gray-800 dark:prose-pre:text-gray-200">
                    {msg.text ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-500">
                        <Loader2 size={14} className="animate-spin" /> 思考中...
                      </span>
                    )}
                  </div>
                )}
              </div>
              {msg.role === 'model' && msg.text && (
                <button
                  onClick={() => onAppendToEditor(msg.text)}
                  className="mt-1 text-xs flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-1"
                  title="追加到编辑器末尾"
                >
                  <PlusCircle size={12} /> 插入到文档
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="relative flex items-end gap-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题... (Shift+Enter 换行)"
            className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 py-2 px-2 text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-none p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors mb-0.5"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
