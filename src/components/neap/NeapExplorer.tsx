import React, { useState } from 'react';
import {
  Layers,
  Database,
  Code2,
  Globe,
  Compass,
  CheckCircle2,
  Search,
  Copy,
  ChevronRight,
  Shield,
  Cpu,
  Terminal,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import {
  ECM_CAPABILITIES,
  ERA_ARCHITECTURE_LAYERS,
  EDS_STANDARDS_CATALOG,
  LOCALES
} from '../../data/neapData';
import { SupportedLocale } from '../../types/neap';
import { useI18n, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/I18nContext';

interface NeapExplorerProps {
  onOpenCodeModal: (title: string, code: string, lang: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const NeapExplorer: React.FC<NeapExplorerProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const { language, setLanguage, isRtl, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'ecm' | 'era' | 'eds' | 'i18n' | 'roadmap'>('ecm');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedL1Id, setSelectedL1Id] = useState<string>(ECM_CAPABILITIES[0].id);
  const [selectedLayerId, setSelectedLayerId] = useState<string>(ERA_ARCHITECTURE_LAYERS[0].id);

  const selectedL1 = ECM_CAPABILITIES.find(c => c.id === selectedL1Id) || ECM_CAPABILITIES[0];
  const selectedLayer = ERA_ARCHITECTURE_LAYERS.find(l => l.id === selectedLayerId) || ERA_ARCHITECTURE_LAYERS[0];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    onTriggerToast(t('common.copied'), 'Snippet copied to clipboard', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      {/* NEAP Header Banner */}
      <div className="mb-8 border border-slate-800 rounded-xl bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PHASE 2 MASTER BLUEPRINT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                TOGAF 10 & DDD ALIGNED
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono uppercase">
              {t('neap.title')}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl font-sans">
              {t('neap.subtitle')}
            </p>
          </div>

          {/* i18n Live Selector */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse bg-slate-950/80 p-2 rounded-lg border border-slate-800 shrink-0">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">{t('common.language')}:</span>
            <div className="flex flex-wrap gap-1">
              {SUPPORTED_LANGUAGES.map(loc => (
                <button
                  key={loc.code}
                  onClick={() => {
                    setLanguage(loc.code);
                    onTriggerToast('Locale Changed', `Switched active locale to ${loc.name}`, 'info');
                  }}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-all cursor-pointer flex items-center space-x-1 rtl:space-x-reverse ${
                    language === loc.code
                      ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{loc.flag}</span>
                  <span>{loc.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('ecm')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
                activeTab === 'ecm'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('neap.layers')}</span>
            </button>

            <button
              onClick={() => setActiveTab('era')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
                activeTab === 'era'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t('neap.security_gates')}</span>
            </button>

            <button
              onClick={() => setActiveTab('eds')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
                activeTab === 'eds'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{t('neap.deployment_matrix')}</span>
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('common.search_placeholder')}
              className="w-full bg-slate-950 text-xs text-slate-200 pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'ecm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider px-1">
                Level 1 Capability Domain
              </h3>
              {ECM_CAPABILITIES.map(cap => (
                <button
                  key={cap.id}
                  onClick={() => setSelectedL1Id(cap.id)}
                  className={`w-full text-left rtl:text-right p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedL1Id === cap.id
                      ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-100">{cap.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cap.description}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white font-mono">{selectedL1.name}</h2>
                <p className="text-sm text-slate-300 mt-2">{selectedL1.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
