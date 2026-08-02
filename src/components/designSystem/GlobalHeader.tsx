import React, { useState } from 'react';
import { NexoraProductId } from '../../types/designSystem';
import { NEXORA_PRODUCTS } from '../../data/nexoraProducts';
import { useI18n, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/I18nContext';
import {
  ChevronDown,
  Command,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  Palette,
  Box,
  LayoutGrid,
  Database,
  Compass,
  Workflow,
  FolderGit2,
  Globe,
  Server,
  Network,
  Package
} from 'lucide-react';

interface GlobalHeaderProps {
  currentProductId: NexoraProductId;
  onSelectProduct: (productId: NexoraProductId) => void;
  activeSection: 'overview' | 'tokens' | 'components' | 'products' | 'edm' | 'neap' | 'eif' | 'npep' | 'srf' | 'nicf' | 'sdk' | 'core' | 'ssg';
  onSelectSection: (section: 'overview' | 'tokens' | 'components' | 'products' | 'edm' | 'neap' | 'eif' | 'npep' | 'srf' | 'nicf' | 'sdk' | 'core' | 'ssg') => void;
  onOpenCommandPalette: () => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  currentProductId,
  onSelectProduct,
  activeSection,
  onSelectSection,
  onOpenCommandPalette,
  onTriggerToast
}) => {
  const { language, setLanguage, t, isRtl } = useI18n();
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const currentProduct = NEXORA_PRODUCTS.find((p) => p.id === currentProductId) || NEXORA_PRODUCTS[0];
  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="bg-[#1e293b] border-b border-[#334155] text-slate-100 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand & Product Switcher Dropdown */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="relative">
              <button
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-700/80 hover:border-sky-500/50 transition-all cursor-pointer shadow-sm"
              >
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: currentProduct.accentColor }}
                />
                <span className="font-bold text-xs tracking-tight uppercase text-white font-mono">
                  {currentProduct.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Product Switcher Dropdown Box */}
              {productDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in duration-100"
                  onMouseLeave={() => setProductDropdownOpen(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono border-b border-slate-800 mb-1">
                    NEXORA Ecosystem Products (10)
                  </div>
                  {NEXORA_PRODUCTS.map((prod) => {
                    const isSelected = prod.id === currentProductId;
                    return (
                      <button
                        key={prod.id}
                        onClick={() => {
                          onSelectProduct(prod.id);
                          onSelectSection('products');
                          setProductDropdownOpen(false);
                          onTriggerToast('Product Switch', `Switched workspace to ${prod.name}`, 'success');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/15 border border-sky-500/40 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: prod.accentColor }}
                          />
                          <div>
                            <div className="font-bold font-mono text-slate-200">{prod.name}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                              {prod.tagline}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
                            ACTIVE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <span className="hidden sm:inline-block bg-slate-800 text-sky-400 border border-slate-700 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
              DESIGN SYSTEM v2.4
            </span>
          </div>

          {/* Quick Search, Command Palette & Global Language Switcher */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Global Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 rounded-md text-xs font-mono font-bold text-sky-200 transition-all cursor-pointer shadow-sm"
                title={t('common.quick_switch')}
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-base leading-none">{currentLangMeta.flag}</span>
                <span className="uppercase tracking-wider">{currentLangMeta.code}</span>
                <ChevronDown className="w-3 h-3 text-sky-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-slate-900 border border-sky-500/40 rounded-xl shadow-2xl z-50 p-2 space-y-1 font-mono text-xs animate-in fade-in duration-100"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                    <span>{t('common.quick_switch')}</span>
                    {isRtl && <span className="text-[9px] bg-sky-900 px-1 rounded text-sky-300">RTL</span>}
                  </div>
                  {SUPPORTED_LANGUAGES.map((langItem) => {
                    const isSelected = langItem.code === language;
                    return (
                      <button
                        key={langItem.code}
                        onClick={() => {
                          setLanguage(langItem.code);
                          setLangDropdownOpen(false);
                          onTriggerToast('Global Language Updated', `Locale changed to ${langItem.nativeName} (${langItem.code.toUpperCase()})`, 'info');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/20 text-white font-bold border border-sky-500/40'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-base leading-none">{langItem.flag}</span>
                          <div>
                            <div className="text-slate-100">{langItem.nativeName}</div>
                            <div className="text-[9px] text-slate-400">{langItem.name}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-700">
                            ACTIVE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/50 rounded-md text-xs text-slate-300 transition-all cursor-pointer font-mono"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('common.search_placeholder')}</span>
              <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 ml-2 rtl:ml-0 rtl:mr-2">
                ⌘ K
              </kbd>
            </button>

            <button
              onClick={onOpenCommandPalette}
              className="md:hidden p-2 bg-slate-900 border border-slate-700 rounded-md text-sky-400 hover:text-white"
              title="Command Palette"
            >
              <Command className="w-4 h-4" />
            </button>

            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[11px] font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
              {t('common.system_status')}
            </div>

            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-slate-950 text-xs font-extrabold shadow-sm">
              LE
            </div>
          </div>
        </div>

        {/* System Navigation Tabs */}
        <div className="flex items-center space-x-1 rtl:space-x-reverse border-t border-[#334155]/60 pt-1 overflow-x-auto font-mono">
          <button
            onClick={() => onSelectSection('overview')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'overview'
                ? 'border-sky-400 text-sky-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('nav.overview')}</span>
          </button>

          <button
            onClick={() => onSelectSection('nicf')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'nicf'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300">{t('nav.nicf')}</span>
          </button>

          <button
            onClick={() => onSelectSection('srf')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'srf'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300">{t('nav.srf')}</span>
          </button>

          <button
            onClick={() => onSelectSection('eif')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'eif'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">{t('nav.eif')}</span>
          </button>

          <button
            onClick={() => onSelectSection('npep')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'npep'
                ? 'border-sky-400 text-sky-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-sky-300">{t('nav.npep')}</span>
          </button>

          <button
            onClick={() => onSelectSection('neap')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'neap'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">{t('nav.neap')}</span>
          </button>

          <button
            onClick={() => onSelectSection('edm')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'edm'
                ? 'border-purple-400 text-purple-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300">{t('nav.edm')}</span>
          </button>

          <button
            onClick={() => onSelectSection('tokens')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'tokens'
                ? 'border-sky-400 text-sky-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>DESIGN TOKENS</span>
          </button>

          <button
            onClick={() => onSelectSection('components')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'components'
                ? 'border-sky-400 text-sky-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>COMPONENT SHOWCASE</span>
          </button>

          <button
            onClick={() => onSelectSection('products')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeSection === 'products'
                ? 'border-sky-400 text-sky-400 bg-slate-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t('nav.forge')} ({currentProduct.name})</span>
          </button>
        </div>
      </div>
    </header>
  );
};

