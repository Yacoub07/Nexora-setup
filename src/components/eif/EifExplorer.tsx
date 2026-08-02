import React, { useState } from 'react';
import {
  Workflow,
  Terminal,
  Bot,
  ShieldCheck,
  FolderTree,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Search,
  Cpu,
  Play,
  Layers,
  FileCode,
  ShieldAlert,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  EIF_PIPELINE_STEPS,
  FORGE_COMMANDS_CATALOG,
  AI_FACTORY_AGENTS,
  QUALITY_GATES_CATALOG,
  MODULE_TEMPLATE_HIERARCHY
} from '../../data/eifData';
import { PipelineStep, ForgeCommandSpec, QualityGateRule } from '../../types/eif';
import { useI18n } from '../../i18n/I18nContext';

interface EifExplorerProps {
  onOpenCodeModal: (title: string, code: string, lang: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const EifExplorer: React.FC<EifExplorerProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'template' | 'forge' | 'ai' | 'gates'>('pipeline');
  const [selectedStepId, setSelectedStepId] = useState<string>(EIF_PIPELINE_STEPS[0].id);
  const [selectedCommand, setSelectedCommand] = useState<ForgeCommandSpec>(FORGE_COMMANDS_CATALOG[0]);
  const [selectedTemplatePath, setSelectedTemplatePath] = useState<string>(MODULE_TEMPLATE_HIERARCHY[2].path);
  const [pipelineCategoryFilter, setPipelineCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive CLI simulation state
  const [cliOutputLogs, setCliOutputLogs] = useState<string[]>([
    'NEXORA Forge CLI v3.0.0 [Engine Ready]',
    'Type or select a command below to simulate module generation...'
  ]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Quality gate compliance tracking state
  const [gateStatusMap, setGateStatusMap] = useState<Record<string, boolean>>({
    'gate-01': true,
    'gate-02': true,
    'gate-03': true,
    'gate-04': true,
    'gate-05': true,
    'gate-06': true,
    'gate-07': true,
    'gate-08': true
  });

  const selectedStep = EIF_PIPELINE_STEPS.find(s => s.id === selectedStepId) || EIF_PIPELINE_STEPS[0];
  const selectedNode = MODULE_TEMPLATE_HIERARCHY.find(n => n.path === selectedTemplatePath) || MODULE_TEMPLATE_HIERARCHY[2];

  const handleCopyCode = (text: string, label: string = 'Snippet') => {
    navigator.clipboard.writeText(text);
    onTriggerToast(t('common.copied'), `${label} copied successfully`, 'success');
  };

  const handleRunForgeCommand = (cmdStr: string) => {
    setIsSimulating(true);
    setCliOutputLogs(prev => [
      ...prev,
      `\n$ ${cmdStr}`,
      '==> Validating module inputs & workspace dependencies...',
      '==> Executing domain generator pipeline [NEXORA EIF v1.0]...',
      '==> Generating domain entity & repository interfaces...',
      '==> Scaffolding FastAPI async router and Pydantic DTOs...',
      '==> Generating React 18 frontend view & i18n dictionaries...',
      '==> Running quality checks...',
      '✔ SUCCESS: Module scaffolded successfully with zero errors!'
    ]);
    setTimeout(() => {
      setIsSimulating(false);
      onTriggerToast('Forge CLI Executed', `Simulated run of: ${cmdStr}`, 'success');
    }, 600);
  };

  const toggleGateStatus = (gateId: string) => {
    setGateStatusMap(prev => {
      const updated = { ...prev, [gateId]: !prev[gateId] };
      onTriggerToast('Quality Gate Toggled', `Gate ${gateId} status updated`, updated[gateId] ? 'success' : 'warning');
      return updated;
    });
  };

  const filteredSteps = EIF_PIPELINE_STEPS.filter(step => {
    const matchesCat = pipelineCategoryFilter === 'ALL' || step.category === pipelineCategoryFilter;
    const matchesSearch = searchQuery === '' ||
      step.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.aiAgentRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      {/* EIF Header Banner */}
      <div className="mb-8 border border-slate-800 rounded-xl bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                EIF VERSION 1.0
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                20-STEP IMPLEMENTATION PIPELINE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono uppercase">
              {t('eif.title')}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl font-sans">
              {t('eif.subtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">{t('common.status')}</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {Object.values(gateStatusMap).filter(Boolean).length} / {QUALITY_GATES_CATALOG.length} GATES GREEN
              </span>
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'pipeline'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>20-Step Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'template'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Module Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('forge')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'forge'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>NEXORA Forge CLI</span>
          </button>

          <button
            onClick={() => setActiveTab('gates')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'gates'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('eif.quality_gates')}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filteredSteps.map(step => (
                <button
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`w-full text-left rtl:text-right p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedStepId === step.id
                      ? 'bg-emerald-950/50 border-emerald-500/60 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">STEP {step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}</span>
                  </div>
                  <h4 className="text-xs font-bold font-mono text-slate-100 truncate">{step.name}</h4>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white font-mono mb-2">{selectedStep.name}</h2>
                <p className="text-sm text-slate-200">{selectedStep.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
