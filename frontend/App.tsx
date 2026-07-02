import React, { useEffect, useState, useCallback } from 'react';
import { Moon, Sun, Download, Trash2, FileText, Bot } from 'lucide-react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import AIChat from './components/AIChat';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_MARKDOWN, STORAGE_KEY, THEME_KEY } from './constants';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useLocalStorage<string>(STORAGE_KEY, DEFAULT_MARKDOWN);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(THEME_KEY, false);
  const [wordCount, setWordCount] = useState(0);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Apply dark mode class to HTML body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Calculate word count
  useEffect(() => {
    const text = markdown.replace(/[#*`_\[\]\(\)>-]/g, ' ').trim();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    // Simple heuristic for Chinese characters + English words
    const chineseChars = text.match(/[一-龥]/g) || [];
    const englishWords = text.replace(/[一-龥]/g, ' ').split(/\s+/).filter(w => w.length > 0);
    setWordCount(chineseChars.length + englishWords.length);
  }, [markdown]);

  const handleClear = () => {
    if (window.confirm('确定要清空所有内容吗？此操作不可恢复。')) {
      setMarkdown('');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAppendFromAI = useCallback((text: string) => {
    setMarkdown(prev => {
      const separator = prev.endsWith('\n\n') ? '' : prev.endsWith('\n') ? '\n' : '\n\n';
      return prev + separator + text;
    });
  }, [setMarkdown]);

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 px-6 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <FileText size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            Tablet Markdown Pro
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
            className={`p-2.5 rounded-full transition-colors flex items-center gap-2 ${
              isAIChatOpen 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800'
            }`}
            title="AI 助手"
          >
            <Bot size={22} />
            <span className="text-sm font-medium hidden sm:inline-block">AI 助手</span>
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>
          <button
            onClick={handleClear}
            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
            title="清空内容"
          >
            <Trash2 size={22} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
            title="下载 Markdown 文件"
          >
            <Download size={22} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-full transition-colors"
            title={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      {/* Main Content - Split Pane */}
      <main className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Pane: Editor */}
        <section className="w-1/2 h-full flex flex-col">
          <Editor value={markdown} onChange={setMarkdown} />
        </section>

        {/* Right Pane: Preview */}
        <section className="w-1/2 h-full border-l border-gray-200 dark:border-gray-800 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-none z-0">
          <Preview content={markdown} isDarkMode={isDarkMode} />
        </section>

        {/* AI Chat Overlay */}
        {isAIChatOpen && (
          <div 
            className="absolute inset-0 bg-black/20 dark:bg-black/40 z-40 transition-opacity"
            onClick={() => setIsAIChatOpen(false)}
          />
        )}
        <AIChat 
          isOpen={isAIChatOpen} 
          onClose={() => setIsAIChatOpen(false)} 
          onAppendToEditor={handleAppendFromAI}
        />
      </main>

      {/* Footer Status Bar */}
      <footer className="flex-none h-8 px-4 flex items-center justify-between bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>{wordCount} 字</span>
          <span>UTF-8</span>
        </div>
        <div>
          <span>自动保存已开启</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
