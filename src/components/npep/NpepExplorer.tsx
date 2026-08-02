import React, { useState } from 'react';
import {
  Layers,
  FolderGit2,
  ListTodo,
  Calendar,
  GitBranch,
  Bot,
  Play,
  CheckCircle2,
  Copy,
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCode,
  Sparkles,
  AlertTriangle,
  Clock,
  Terminal,
  Globe
} from 'lucide-react';
import {
  NPEP_PRODUCTS,
  NPEP_EPICS,
  NPEP_USER_STORIES,
  DEVELOPMENT_ORDER_STEPS,
  RELEASE_MILESTONES,
  SPRINT_DEFINITIONS,
  GITHUB_ROADMAP_CONFIG
} from '../../data/npepData';
import { AI_FACTORY_AGENTS } from '../../data/eifData';
import { ProductDefinition, Epic, UserStory, ReleaseMilestone } from '../../types/npep';
import { useI18n } from '../../i18n/I18nContext';

interface NpepExplorerProps {
  onOpenCodeModal: (title: string, code: string, lang: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const NpepExplorer: React.FC<NpepExplorerProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'products' | 'epics' | 'stories' | 'order' | 'roadmap' | 'sprints' | 'ai' | 'github'>('products');
  const [selectedProductId, setSelectedProductId] = useState<string>(NPEP_PRODUCTS[0].id);
  const [selectedEpicId, setSelectedEpicId] = useState<string>(NPEP_EPICS[0].id);
  const [selectedStoryId, setSelectedStoryId] = useState<string>(NPEP_USER_STORIES[0].id);
  const [selectedMilestoneVersion, setSelectedMilestoneVersion] = useState<string>(RELEASE_MILESTONES[0].version);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedProduct = NPEP_PRODUCTS.find(p => p.id === selectedProductId) || NPEP_PRODUCTS[0];
  const selectedEpic = NPEP_EPICS.find(e => e.id === selectedEpicId) || NPEP_EPICS[0];
  const selectedStory = NPEP_USER_STORIES.find(s => s.id === selectedStoryId) || NPEP_USER_STORIES[0];
  const selectedMilestone = RELEASE_MILESTONES.find(m => m.version === selectedMilestoneVersion) || RELEASE_MILESTONES[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onTriggerToast(t('common.copied'), `${label} copied successfully`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      {/* NPEP Header Banner */}
      <div className="mb-8 border border-slate-800 rounded-xl bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                NPEP PHASE 3 – VERSION 1.0
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ARCHITECTURE FREEZE ACTIVE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono uppercase">
              {t('npep.title')}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl font-sans">
              {t('npep.subtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 shrink-0">
            <Zap className="w-5 h-5 text-sky-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Product Roadmap Readiness</span>
              <span className="text-xs font-mono font-bold text-sky-400">
                12 DEVELOPMENT STEPS READY
              </span>
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'products'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Product Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('epics')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'epics'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Epics & Features</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'stories'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>User Stories & Tasks</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider px-1 mb-2">
                NEXORA Products Matrix
              </h3>
              {NPEP_PRODUCTS.map(prod => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`w-full text-left rtl:text-right p-3.5 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                    selectedProductId === prod.id
                      ? 'bg-sky-950/50 border-sky-500/60 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white mt-1">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{prod.mission}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold font-mono text-white">{selectedProduct.name}</h2>
                <p className="text-sm text-slate-300 mt-2">{selectedProduct.mission}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
