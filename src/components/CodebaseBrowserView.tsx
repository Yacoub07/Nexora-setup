import React, { useState, useEffect } from 'react';
import { Code2, FileText, Folder, Copy, Check, Layers, ChevronRight, Download } from 'lucide-react';
import { FileNode } from '../types';
import { FORGE_FILE_TREE, FORGE_FILE_CONTENTS } from '../data/forgeRepoData';
import { useI18n } from '../i18n/I18nContext';

interface CodebaseBrowserViewProps {
  fileTree?: FileNode | null;
  onReadFileContent?: (path: string) => Promise<string>;
}

export const CodebaseBrowserView: React.FC<CodebaseBrowserViewProps> = ({
  fileTree = FORGE_FILE_TREE,
  onReadFileContent
}) => {
  const { t } = useI18n();
  const [selectedFile, setSelectedFile] = useState<string>('nexora/cli.py');
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'code' | 'architecture'>('code');

  const activeTree = fileTree || FORGE_FILE_TREE;

  useEffect(() => {
    if (selectedFile) {
      loadContent(selectedFile);
    }
  }, [selectedFile]);

  const loadContent = async (path: string) => {
    setIsLoading(true);
    try {
      if (onReadFileContent) {
        const content = await onReadFileContent(path);
        setFileContent(content);
      } else {
        const content = FORGE_FILE_CONTENTS[path] || `# Content for ${path} initialized in NEXORA Forge v0.1.0`;
        setFileContent(content);
      }
    } catch (err: any) {
      setFileContent(`# Error loading file ${path}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTree = (node: FileNode, depth = 0) => {
    if (node.type === 'directory') {
      return (
        <div key={node.path} className="space-y-1">
          <div
            className="flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-200"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            <Folder className="w-3.5 h-3.5 text-cyan-500 mr-1 rtl:mr-0 rtl:ml-1" />
            <span>{node.name}</span>
          </div>
          {node.children && node.children.map(child => renderTree(child, depth + 1))}
        </div>
      );
    }

    const isSelected = selectedFile === node.path;
    return (
      <button
        key={node.path}
        onClick={() => setSelectedFile(node.path)}
        className={`w-full text-left rtl:text-right flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 rounded text-xs font-mono transition-colors ${
          isSelected
            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <FileText className={`w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header Mode Toggle */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Code2 className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white uppercase tracking-tight font-mono">{t('codebase.title')}</h2>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
              viewMode === 'code' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            FILE TREE
          </button>
          <button
            onClick={() => setViewMode('architecture')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
              viewMode === 'architecture' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            CLEAN ARCH SPEC
          </button>
        </div>
      </div>

      {viewMode === 'code' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left File Tree Sidebar */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 shadow-md max-h-[600px] overflow-y-auto space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-[#334155] pb-2 font-mono">
              {t('codebase.files')}
            </div>
            {activeTree ? (
              renderTree(activeTree)
            ) : (
              <div className="text-xs text-slate-500 font-mono py-4 text-center">
                Loading codebase file tree...
              </div>
            )}
          </div>

          {/* Right Code Viewer */}
          <div className="lg:col-span-3 cli-output overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-[#1e293b] border-b border-[#334155] flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 font-mono flex items-center">
                <FileText className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-sky-400" />
                {selectedFile}
              </span>

              <button
                onClick={handleCopy}
                disabled={isLoading}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors flex items-center cursor-pointer font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1 rtl:mr-0 rtl:ml-1" /> : <Copy className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />}
                {copied ? t('common.copied') : t('common.copy')}
              </button>
            </div>

            <div className="p-4 bg-[#020617] overflow-x-auto max-h-[550px]">
              {isLoading ? (
                <div className="text-xs text-slate-500 py-8 text-center font-mono animate-pulse">
                  Loading {selectedFile}...
                </div>
              ) : (
                <pre className="text-xs font-mono text-sky-100 leading-relaxed whitespace-pre">
                  {fileContent}
                </pre>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Architecture Visualizer */
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6">
          <div className="border-b border-[#334155] pb-4">
            <h3 className="text-base font-bold text-white flex items-center uppercase font-mono tracking-tight">
              <Layers className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-sky-400" />
              Clean Architecture Flow Specification
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Strict rule: Commands must contain ZERO business logic. All logic belongs in Services.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
