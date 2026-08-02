import React from 'react';
import { NexoraProductId } from '../../types/designSystem';
import { NEXORA_PRODUCTS } from '../../data/nexoraProducts';
import { useI18n } from '../../i18n/I18nContext';
import {
  Layers,
  Palette,
  Box,
  Terminal,
  ShieldCheck,
  Zap,
  Sparkles,
  Layout,
  CheckCircle2,
  Sliders,
  Code2,
  Grid,
  Bot
} from 'lucide-react';

interface DesignSystemOverviewProps {
  onSelectSection: (section: 'overview' | 'tokens' | 'components' | 'products' | 'edm' | 'neap' | 'eif' | 'npep') => void;
  onSelectProduct: (productId: NexoraProductId) => void;
  onOpenCodeModal: (title: string, code: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const DesignSystemOverview: React.FC<DesignSystemOverviewProps> = ({
  onSelectSection,
  onSelectProduct,
  onOpenCodeModal,
  onTriggerToast
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-8 font-mono">
      {/* Hero Welcome Container */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase">
              {t('overview.badge_visual')}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
              {t('overview.badge_ready')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
            {t('overview.title')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            {t('overview.description')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectSection('tokens')}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded transition-all shadow-md cursor-pointer flex items-center"
            >
              <Palette className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('overview.explore_tokens')}
            </button>

            <button
              onClick={() => onSelectSection('components')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded transition-all cursor-pointer flex items-center"
            >
              <Box className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-sky-400" />
              {t('overview.view_library')}
            </button>

            <button
              onClick={() =>
                onOpenCodeModal(
                  'NEXORA Design System Quickstart',
                  `// Install NEXORA Design System Tokens\nimport "@nexora/design-system/styles.css";\nimport { Button, DataGrid, MetricChart, CommandPalette } from "@nexora/ui";\n\nexport function App() {\n  return (\n    <Button variant="primary" size="sm">\n      EXECUTE PIPELINE\n    </Button>\n  );\n}`
                )
              }
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 text-xs rounded transition-colors cursor-pointer flex items-center"
            >
              <Code2 className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
              {t('overview.quickstart')}
            </button>
          </div>
        </div>
      </div>

      {/* Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-5 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sky-400 font-bold text-xs uppercase">
            <Zap className="w-4 h-4" />
            <span>{t('overview.pillar_1_title')}</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {t('overview.pillar_1_desc')}
          </p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-5 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-purple-400 font-bold text-xs uppercase">
            <Palette className="w-4 h-4" />
            <span>{t('overview.pillar_2_title')}</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {t('overview.pillar_2_desc')}
          </p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-5 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400 font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('overview.pillar_3_title')}</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {t('overview.pillar_3_desc')}
          </p>
        </div>
      </div>

      {/* 10 Products Overview Grid */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-4">
        <div className="border-b border-[#334155] pb-3 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase">{t('overview.products_title')}</h3>
          <span className="text-xs text-sky-400 font-bold">{t('overview.products_tag')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {NEXORA_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                onSelectProduct(prod.id);
                onSelectSection('products');
              }}
              className="bg-[#020617] border border-slate-800 rounded-lg p-3.5 space-y-2 hover:border-sky-500/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: prod.accentColor }}
                />
                <span className="text-[9px] font-bold uppercase text-slate-500">{prod.category.split(' ')[0]}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  {prod.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-2 mt-0.5 leading-relaxed">
                  {prod.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
