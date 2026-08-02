import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  ListTodo,
  Layers,
  ShieldCheck,
  Database,
  Code2,
  Cpu,
  Search,
  Download,
  Copy,
  ExternalLink,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  User,
  Filter,
  Check,
  FileCode,
  AlertTriangle,
  FolderArchive,
  Eye,
  Server
} from 'lucide-react';
import { SPRINT_1_PACKAGE } from '../../data/ssgData';
import { SsgDocument, SsgAtomicTask } from '../../types/ssg';

interface SsgExplorerProps {
  onOpenCodeModal: (title: string, code: string, lang?: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const SsgExplorer: React.FC<SsgExplorerProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'DOCUMENTS' | 'TASKS' | 'EXPORT'>('DOCUMENTS');
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-readme');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);
  const [taskFilter, setTaskFilter] = useState<string>('ALL');

  const activeDoc = SPRINT_1_PACKAGE.documents.find((d) => d.id === selectedDocId) || SPRINT_1_PACKAGE.documents[0];

  const filteredDocs = SPRINT_1_PACKAGE.documents.filter((doc) => {
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredTasks = SPRINT_1_PACKAGE.atomicTasks.filter((task) => {
    if (taskFilter === 'ALL') return true;
    return task.priority === taskFilter;
  });

  const handleCopyContent = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
    onTriggerToast('Copied to Clipboard', `Copied ${label} to clipboard`, 'success');
  };

  const handleDownloadPackageZip = () => {
    const jsonBlob = new Blob([JSON.stringify(SPRINT_1_PACKAGE, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXORA_Sprint_1_Package_${SPRINT_1_PACKAGE.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onTriggerToast('Export Successful', 'Downloaded Sprint 1 Engineering Package JSON Bundle', 'success');
  };

  const getCategoryBadgeClass = (category: SsgDocument['category']) => {
    switch (category) {
      case 'BUSINESS':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ARCHITECTURE':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'DATABASE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'API':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'SECURITY':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'TESTING':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'OPS':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Phase 9 - Sprint Engineering Package Generator (SSG)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {SPRINT_1_PACKAGE.sprintId} | v{SPRINT_1_PACKAGE.version}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Sprint Engineering Package Spec
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              Complete, authoritative 24-document engineering specification for{' '}
              <span className="text-indigo-300 font-semibold">{SPRINT_1_PACKAGE.sprintName}</span>. Ready for immediate autonomous AI code execution by Codex.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPackageZip}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              Download Package (.JSON)
            </button>

            <button
              onClick={() => onOpenCodeModal('Sprint 1 OpenAPI 3.1 Spec', SPRINT_1_PACKAGE.documents.find(d => d.id === 'doc-openapi')?.content || '', 'yaml')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              OpenAPI YAML
            </button>
          </div>
        </div>
      </div>

      {/* Top Level Nav Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('DOCUMENTS')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'DOCUMENTS'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>24 Engineering Documents ({SPRINT_1_PACKAGE.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('TASKS')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'TASKS'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Atomic Tasks WBS ({SPRINT_1_PACKAGE.atomicTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EXPORT')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'EXPORT'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>Package Export & Bundle</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden md:block">
          Codex Execution Ready: <span className="text-emerald-400 font-bold">100% COMPLETE</span>
        </div>
      </div>

      {/* TAB 1: DOCUMENTS VIEWER */}
      {activeTab === 'DOCUMENTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Document List */}
          <div className="lg:col-span-4 space-y-3">
            {/* Search & Filter Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search 24 documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['ALL', 'BUSINESS', 'ARCHITECTURE', 'DATABASE', 'API', 'SECURITY', 'TESTING', 'OPS'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors shrink-0 cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Cards */}
            <div className="space-y-1.5 max-h-[650px] overflow-y-auto pr-1">
              {filteredDocs.map((doc) => {
                const isSelected = doc.id === activeDoc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span className="font-mono text-xs font-semibold truncate">{doc.filename}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{doc.title}</p>
                    </div>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border ${getCategoryBadgeClass(
                        doc.category
                      )}`}
                    >
                      {doc.category}
                    </span>
                  </button>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-xl">
                  No matching documents found.
                </div>
              )}
            </div>
          </div>

          {/* Document Content Detail View */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            {/* Document Action Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-mono text-sm font-bold text-white truncate">{activeDoc.filename}</h3>
                  <p className="text-xs text-slate-400 truncate">{activeDoc.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeClass(activeDoc.category)}`}>
                  {activeDoc.category}
                </span>

                <button
                  onClick={() => handleCopyContent(activeDoc.content, activeDoc.filename)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedDoc ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => onOpenCodeModal(activeDoc.filename, activeDoc.content, activeDoc.format)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-6 bg-slate-950/50 overflow-y-auto max-h-[600px] font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
              {activeDoc.content}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATOMIC TASKS WBS */}
      {activeTab === 'TASKS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <ListTodo className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Work Breakdown Structure (WBS) - Sprint 1</h3>
                <p className="text-xs text-slate-400">10 Atomic Tasks immediately assignable to developers or Codex AI agents</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Filter Priority:</span>
              {['ALL', 'P0', 'P1', 'P2'].map((p) => (
                <button
                  key={p}
                  onClick={() => setTaskFilter(p)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    taskFilter === p ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {task.id}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.priority === 'P0'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {task.status}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">{task.title}</h4>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{task.owner}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Est: {task.estimatedHours} hrs</span>
                  </div>
                </div>

                {task.dependencies.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500 font-medium">Dependencies: </span>
                    <span className="font-mono text-indigo-300">{task.dependencies.join(', ')}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Deliverables:</span>
                  <div className="flex flex-wrap gap-1">
                    {task.deliverables.map((deliv, idx) => (
                      <span key={idx} className="font-mono text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                        {deliv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PACKAGE EXPORT */}
      {activeTab === 'EXPORT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-indigo-400" />
              NEXORA Sprint Engineering Package Export
            </h3>
            <p className="text-xs text-slate-400">
              Export the complete 24-document Sprint 1 Package in standardized JSON format for automated ingestion into Codex, CI/CD pipelines, or architectural repositories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold">TOTAL DOCUMENTS</span>
              <p className="text-2xl font-bold text-white">{SPRINT_1_PACKAGE.documents.length} Files</p>
              <p className="text-[11px] text-slate-500">Includes OpenAPI, SQL DDL, Diagrams & Requirements</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">ATOMIC TASKS</span>
              <p className="text-2xl font-bold text-white">{SPRINT_1_PACKAGE.atomicTasks.length} Tasks</p>
              <p className="text-[11px] text-slate-500">78 Total Estimated Hours across 4 roles</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-xs font-mono text-amber-400 font-bold">COMPLIANCE</span>
              <p className="text-2xl font-bold text-white">100% Ready</p>
              <p className="text-[11px] text-slate-500">Zero Ambiguity for Codex Autopilot</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm font-bold text-white">Full Package JSON Bundle</span>
              <p className="text-xs text-slate-400">Download single-file JSON artifact containing all 24 documents & atomic WBS</p>
            </div>

            <button
              onClick={handleDownloadPackageZip}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Sprint 1 Package JSON</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
