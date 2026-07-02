import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewProps {
  content: string;
  isDarkMode: boolean;
}

const Preview: React.FC<PreviewProps> = ({ content, isDarkMode }) => {
  return (
    <div className="h-full w-full overflow-y-auto p-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="prose prose-lg dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-img:rounded-xl prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400"
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="rounded-lg overflow-hidden my-6 border border-gray-200 dark:border-gray-800">
                  <div className="bg-gray-200 dark:bg-gray-800 px-4 py-1.5 text-xs font-mono text-gray-600 dark:text-gray-400 flex justify-between items-center">
                    <span>{match[1]}</span>
                  </div>
                  <SyntaxHighlighter
                    {...props}
                    style={isDarkMode ? vscDarkPlus : vs}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, padding: '1rem', background: isDarkMode ? '#111827' : '#ffffff' }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code {...props} className={`${className} bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400`}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Preview;
