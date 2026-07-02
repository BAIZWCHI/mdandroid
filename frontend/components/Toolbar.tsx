import React from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Quote, 
  Code, 
  Link, 
  Image as ImageIcon,
  Minus
} from 'lucide-react';

interface ToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
  >
    {icon}
  </button>
);

const Toolbar: React.FC<ToolbarProps> = ({ onInsert }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 no-select overflow-x-auto">
      <ToolbarButton icon={<Bold size={20} />} label="粗体" onClick={() => onInsert('**', '**')} />
      <ToolbarButton icon={<Italic size={20} />} label="斜体" onClick={() => onInsert('*', '*')} />
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
      <ToolbarButton icon={<Heading1 size={20} />} label="标题 1" onClick={() => onInsert('# ')} />
      <ToolbarButton icon={<Heading2 size={20} />} label="标题 2" onClick={() => onInsert('## ')} />
      <ToolbarButton icon={<Heading3 size={20} />} label="标题 3" onClick={() => onInsert('### ')} />
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
      <ToolbarButton icon={<List size={20} />} label="无序列表" onClick={() => onInsert('- ')} />
      <ToolbarButton icon={<ListOrdered size={20} />} label="有序列表" onClick={() => onInsert('1. ')} />
      <ToolbarButton icon={<CheckSquare size={20} />} label="任务列表" onClick={() => onInsert('- [ ] ')} />
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
      <ToolbarButton icon={<Quote size={20} />} label="引用" onClick={() => onInsert('> ')} />
      <ToolbarButton icon={<Code size={20} />} label="代码块" onClick={() => onInsert('```\n', '\n```')} />
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
      <ToolbarButton icon={<Link size={20} />} label="链接" onClick={() => onInsert('[', '](url)')} />
      <ToolbarButton icon={<ImageIcon size={20} />} label="图片" onClick={() => onInsert('![alt](', ')')} />
      <ToolbarButton icon={<Minus size={20} />} label="分割线" onClick={() => onInsert('\n---\n')} />
    </div>
  );
};

export default Toolbar;
