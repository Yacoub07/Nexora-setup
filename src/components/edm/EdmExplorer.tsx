import React, { useState } from 'react';
import {
  EDM_BOUNDED_CONTEXTS,
  EDM_ENTITIES,
  EDM_RBAC_MATRIX,
  EDM_MODULE_NODES,
  DDL_POSTGRES_SCHEMA
} from '../../data/edmModel';
import { DomainEntity } from '../../types/edm';
import { useI18n } from '../../i18n/I18nContext';
import {
  Database,
  Layers,
  ShieldCheck,
  Code2,
  Workflow,
  Search,
  BookOpen,
  GitBranch,
  Bot,
  Server,
  FileText,
  Copy,
  Check,
  ArrowRight,
  Boxes,
  Key,
  Users,
  Activity,
  Cpu,
  Zap,
  Globe
} from 'lucide-react';

interface EdmExplorerProps {
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
  onOpenCodeModal: (title: string, code: string) => void;
}

export const EdmExplorer: React.FC<EdmExplorerProps> = ({ onTriggerToast, onOpenCodeModal }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<
    'vision' | 'ddd' | 'entities' | 'relationships' | 'uml' | 'database' | 'api' | 'rbac' | 'modules' | 'standards'
  >('vision');

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('entity-org');
  const [copiedDdl, setCopiedDdl] = useState<boolean>(false);

  const categories = [
    'ALL',
    'Organization',
    'Identity & Access',
    'Platform',
    'Development',
    'Knowledge',
    'Automation',
    'AI',
    'Analytics',
    'Audit & Security'
  ];

  const filteredEntities = EDM_ENTITIES.filter((e) => {
    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.postgresTable.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedEntity = EDM_ENTITIES.find((e) => e.id === selectedEntityId) || EDM_ENTITIES[0];

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(DDL_POSTGRES_SCHEMA);
    setCopiedDdl(true);
    onTriggerToast('DDL Schema Copied', 'PostgreSQL DDL SQL script copied to clipboard.', 'success');
    setTimeout(() => setCopiedDdl(false), 3000);
  };

  return (
    <div className="space-y-6 font-mono text-slate-100">
      {/* Top EDM Header Banner */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase">
                MASTER DOMAIN ARCHITECTURE v1.0
              </span>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase">
                SINGLE SOURCE OF TRUTH
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase mt-2 flex items-center">
              <Database className="w-6 h-6 mr-2.5 rtl:mr-0 rtl:ml-2.5 text-sky-400" />
              {t('edm.title')}
            </h1>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mt-1 max-w-3xl">
              {t('edm.subtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => onOpenCodeModal('Complete PostgreSQL DDL Schema', DDL_POSTGRES_SCHEMA)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 font-bold text-xs rounded transition-colors cursor-pointer flex items-center"
            >
              <Code2 className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
              {t('edm.inspect_ddl')}
            </button>
            <button
              onClick={handleCopyDdl}
              className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer flex items-center shadow-md"
            >
              {copiedDdl ? <Check className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" /> : <Copy className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />}
              {t('edm.copy_ddl')}
            </button>
          </div>
        </div>

        {/* EDM Navigation Sub-Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex space-x-1 rtl:space-x-reverse overflow-x-auto">
          {[
            { id: 'vision', label: t('edm.tab_vision'), icon: Globe },
            { id: 'ddd', label: t('edm.tab_ddd'), icon: Layers },
            { id: 'entities', label: t('edm.tab_entities'), icon: Boxes },
            { id: 'relationships', label: t('edm.tab_relationships'), icon: GitBranch },
            { id: 'uml', label: t('edm.tab_uml'), icon: Workflow },
            { id: 'database', label: t('edm.tab_database'), icon: Database },
            { id: 'api', label: t('edm.tab_api'), icon: Server },
            { id: 'rbac', label: t('edm.tab_rbac'), icon: ShieldCheck },
            { id: 'modules', label: t('edm.tab_modules'), icon: Cpu },
            { id: 'standards', label: t('edm.tab_standards'), icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center shrink-0 ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: VISION & EXECUTIVE SUMMARY */}
      {activeTab === 'vision' && (
        <div className="space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase border-b border-slate-800 pb-3 flex items-center">
              <Globe className="w-4 h-4 text-sky-400 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('edm.tab_vision')}
            </h2>
            <div className="text-xs text-slate-300 font-sans space-y-3 leading-relaxed">
              <p>
                The <strong>NEXORA Enterprise Digital Operating System</strong> is engineered as a unified multi-tenant platform designed to power modern cloud-native enterprises. Operating across four strategic pillars—<strong>NEXORA Forge</strong>, <strong>NEXORA SDK</strong>, <strong>NEXORA Studio</strong>, and <strong>NEXORA Platform</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DDD BOUNDED CONTEXTS */}
      {activeTab === 'ddd' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white uppercase flex items-center">
              <Layers className="w-4 h-4 text-sky-400 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('edm.tab_ddd')} ({EDM_BOUNDED_CONTEXTS.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EDM_BOUNDED_CONTEXTS.map((bc) => (
              <div key={bc.id} className="bg-[#020617] border border-slate-800 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      bc.type === 'Core'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        : bc.type === 'Supporting'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {bc.type} Domain
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Aggregates: {bc.aggregates.length}</span>
                </div>

                <h3 className="text-xs font-bold text-white">{bc.name}</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{bc.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ENTITY CATALOG */}
      {activeTab === 'entities' && (
        <div className="space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 uppercase mr-1">{t('common.category')}:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-[#020617] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search_placeholder')}
                className="w-full bg-[#020617] border border-slate-700 rounded pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 space-y-2 max-h-[600px] overflow-y-auto">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-2">
                {t('edm.entities')} ({filteredEntities.length})
              </div>

              {filteredEntities.map((ent) => (
                <button
                  key={ent.id}
                  onClick={() => setSelectedEntityId(ent.id)}
                  className={`w-full text-left rtl:text-right p-3 rounded-lg border transition-all cursor-pointer ${
                    ent.id === selectedEntityId
                      ? 'bg-slate-900 border-sky-500 text-white shadow-md'
                      : 'bg-[#020617] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold font-mono text-sky-400">{ent.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                      {ent.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="md:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-bold text-white font-mono">{selectedEntity.name}</h2>
              <p className="text-xs text-slate-300 font-sans">{selectedEntity.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: DATABASE ARCHITECTURE */}
      {activeTab === 'database' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white uppercase flex items-center">
              <Database className="w-4 h-4 text-amber-400 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('edm.tab_database')}
            </h2>
            <button
              onClick={handleCopyDdl}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer flex items-center"
            >
              <Copy className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
              {t('edm.copy_ddl')}
            </button>
          </div>

          <pre className="text-xs text-emerald-400 bg-[#020617] p-4 rounded-lg border border-slate-800 font-mono overflow-x-auto max-h-[500px]">
            {DDL_POSTGRES_SCHEMA}
          </pre>
        </div>
      )}
    </div>
  );
};
