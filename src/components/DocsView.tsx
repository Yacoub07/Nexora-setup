import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Check, Copy } from 'lucide-react';
import { FORGE_FILE_CONTENTS } from '../data/forgeRepoData';
import { useI18n } from '../i18n/I18nContext';

interface DocsViewProps {
  onReadFileContent?: (path: string) => Promise<string>;
}

export const DocsView: React.FC<DocsViewProps> = ({ onReadFileContent }) => {
  const { t } = useI18n();
  const [activeDoc, setActiveDoc] = useState<string>('README.md');
  const [docContent, setDocContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const docs = [
    { id: 'README.md', label: 'README Overview', icon: BookOpen },
    { id: 'CHANGELOG.md', label: 'Changelog', icon: FileText },
    { id: 'CONTRIBUTING.md', label: 'Developer Guide', icon: FileText },
    { id: 'SECURITY.md', label: 'Security Policy', icon: FileText },
  ];

  useEffect(() => {
    loadDoc(activeDoc);
  }, [activeDoc]);

  const loadDoc = async (path: string) => {
    setIsLoading(true);
    try {
      if (onReadFileContent) {
        const content = await onReadFileContent(path);
        setDocContent(content);
      } else {
        const content = FORGE_FILE_CONTENTS[path] || `# Documentation for ${path}\nNEXORA Forge v0.1.0 Sprint 1 Genesis`;
        setDocContent(content);
      }
    } catch (err: any) {
      setDocContent(`# Error loading doc ${path}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Doc Navigation Tabs */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">{t('docs.title')}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {docs.map((doc) => {
            const Icon = doc.icon;
            const isActive = activeDoc === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc.id)}
                className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{doc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doc Reader Area */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#334155] pb-4">
          <span className="text-xs font-mono text-sky-400 font-bold uppercase">{activeDoc}</span>
          <button
            onClick={handleCopy}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors flex items-center font-mono cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1 rtl:mr-0 rtl:ml-1" /> : <Copy className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />}
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-mono animate-pulse">
            Loading documentation...
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap bg-[#020617] p-6 rounded border border-slate-800">
            {docContent}
          </div>
        )}
      </div>
    </div>
  );
};
