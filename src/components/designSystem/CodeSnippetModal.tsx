import React, { useState } from 'react';
import { Check, Copy, X, Code2 } from 'lucide-react';

interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  code: string;
  language?: string;
}

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({
  isOpen,
  onClose,
  title,
  code,
  language = 'tsx'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono">
            <Code2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase">{title}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
              {language}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded transition-colors flex items-center cursor-pointer font-mono shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'COPIED TO CLIPBOARD' : 'COPY CODE'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-5 bg-slate-950 overflow-auto font-mono text-xs text-sky-200 leading-relaxed max-h-[600px]">
          <pre>{code}</pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between items-center">
          <span>NEXORA Reusable Component Token</span>
          <span className="text-slate-500">React + Tailwind v4 CSS</span>
        </div>
      </div>
    </div>
  );
};
