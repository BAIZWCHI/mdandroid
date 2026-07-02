import React, { useRef, useCallback } from 'react';
import Toolbar from './Toolbar';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsert = useCallback((prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    onChange(newText);

    // Set focus and cursor position after React updates the value
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(
        selectedText.length > 0 ? newCursorPos + suffix.length : start + prefix.length,
        selectedText.length > 0 ? newCursorPos + suffix.length : start + prefix.length
      );
    }, 0);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      handleInsert('  '); // Insert 2 spaces
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <Toolbar onInsert={handleInsert} />
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full p-6 resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200 font-mono text-lg leading-relaxed"
          placeholder="在此输入 Markdown 文本..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default Editor;
