import React, { useState } from 'react';
import { NexoraProductId } from '../../types/designSystem';
import { NEXORA_PRODUCTS } from '../../data/nexoraProducts';
import { useI18n } from '../../i18n/I18nContext';
import {
  Layers,
  Palette,
  Box,
  LayoutGrid,
  Command,
  Activity,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Database,
  Compass,
  Workflow,
  FolderGit2,
  Server,
  Network,
  Package
} from 'lucide-react';

interface GlobalSidebarProps {
  currentProductId: NexoraProductId;
  onSelectProduct: (productId: NexoraProductId) => void;
  activeSection: 'overview' | 'tokens' | 'components' | 'products' | 'edm' | 'neap' | 'eif' | 'npep' | 'srf' | 'nicf' | 'sdk' | 'core' | 'ssg';
  onSelectSection: (section: 'overview' | 'tokens' | 'components' | 'products' | 'edm' | 'neap' | 'eif' | 'npep' | 'srf' | 'nicf' | 'sdk' | 'core' | 'ssg') => void;
  onOpenCommandPalette: () => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  currentProductId,
  onSelectProduct,
  activeSection,
  onSelectSection,
  onOpenCommandPalette,
  onTriggerToast
}) => {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-[#1e293b] border-r border-[#334155] text-slate-200 flex flex-col justify-between transition-all duration-200 shrink-0 font-mono ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-3 space-y-6">
        {/* Collapse Toggle Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          {!collapsed && (
            <div className="text-xs font-bold text-sky-400 uppercase tracking-tight">
              NEXORA ECOSYSTEM
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 bg-slate-900 border border-slate-700 hover:text-white rounded transition-colors mx-auto cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* 1. Design System Core Section */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
              Architecture & Frameworks
            </div>
          )}

          <button
            onClick={() => onSelectSection('overview')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{t('nav.overview')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('core')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'core'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-cyan-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
            {!collapsed && <span>{t('nav.corePlatform')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('ssg')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'ssg'
                ? 'bg-indigo-500 text-white font-bold'
                : 'hover:bg-slate-800 text-indigo-300'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
            {!collapsed && <span>{t('nav.ssg')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('sdk')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'sdk'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-cyan-300'
            }`}
          >
            <Package className="w-4 h-4 shrink-0 text-cyan-400" />
            {!collapsed && <span>{t('nav.sdk')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('nicf')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'nicf'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-cyan-300'
            }`}
          >
            <Network className="w-4 h-4 shrink-0 text-cyan-400" />
            {!collapsed && <span>{t('nav.nicf')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('srf')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'srf'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-cyan-300'
            }`}
          >
            <Server className="w-4 h-4 shrink-0 text-cyan-400" />
            {!collapsed && <span>{t('nav.srf')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('eif')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'eif'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-emerald-300'
            }`}
          >
            <Workflow className="w-4 h-4 shrink-0 text-emerald-400" />
            {!collapsed && <span>{t('nav.eif')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('npep')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'npep'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-sky-300'
            }`}
          >
            <FolderGit2 className="w-4 h-4 shrink-0 text-sky-400" />
            {!collapsed && <span>{t('nav.npep')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('neap')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'neap'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-emerald-300'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0 text-emerald-400" />
            {!collapsed && <span>{t('nav.neap')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('edm')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'edm'
                ? 'bg-purple-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-purple-300'
            }`}
          >
            <Database className="w-4 h-4 shrink-0 text-purple-400" />
            {!collapsed && <span>{t('nav.edm')}</span>}
          </button>

          <button
            onClick={() => onSelectSection('tokens')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'tokens'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Design Tokens</span>}
          </button>

          <button
            onClick={() => onSelectSection('components')}
            className={`w-full flex items-center space-x-2.5 rtl:space-x-reverse px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              activeSection === 'components'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Box className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Component Showcase</span>}
          </button>
        </div>

        {/* 2. All 10 NEXORA Products Suite */}
        <div className="space-y-1 pt-2 border-t border-slate-800">
          {!collapsed && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
              NEXORA Products (10)
            </div>
          )}

          <div className="max-h-[320px] overflow-y-auto space-y-1">
            {NEXORA_PRODUCTS.map((prod) => {
              const isSelected = prod.id === currentProductId && activeSection === 'products';
              return (
                <button
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct(prod.id);
                    onSelectSection('products');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border border-sky-500/50 text-sky-300 font-bold'
                      : 'hover:bg-slate-800 text-slate-400'
                  }`}
                  title={prod.name}
                >
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: prod.accentColor }}
                    />
                    {!collapsed && <span className="truncate">{prod.name}</span>}
                  </div>
                  {!collapsed && isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer System Health */}
      <div className="p-3 border-t border-slate-800 bg-[#020617] text-[10px] space-y-2">
        {!collapsed && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>{t('common.app_title')}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-slate-500">{t('common.system_status')}</div>
          </div>
        )}
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 rounded cursor-pointer"
        >
          <Command className="w-3 h-3" />
          {!collapsed && <span>Cmd + K</span>}
        </button>
      </div>
    </aside>
  );
};

