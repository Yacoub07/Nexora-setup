import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity,
  Sparkles,
  Workflow,
  Database,
  Search,
  Copy,
  Check,
  ChevronRight,
  Code2,
  Sliders,
  FolderTree,
  Lock,
  Server,
  Zap,
  Play,
  Bell,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Compass,
  Radio,
  Tag,
  Box,
  HardDrive,
  Calendar,
  Cpu as AiIcon,
  Filter,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  SRF_SERVICES_CATALOG,
  SRF_ARCHITECTURE_LAYERS,
  SAMPLE_SRF_EVENTS,
  SAMPLE_SRF_FLAGS,
  SAMPLE_SRF_PROMPTS
} from '../../data/srfData';
import { SrfServiceSpec, SrfCategory, SrfDomainEvent, SrfFeatureFlag, SrfAiPromptTemplate } from '../../types/srf';
import { useI18n } from '../../i18n/I18nContext';

interface SrfExplorerProps {
  onOpenCodeModal: (title: string, code: string, lang: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const SrfExplorer: React.FC<SrfExplorerProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'services' | 'architecture' | 'eventbus' | 'featureflags' | 'airuntime' | 'observability'>('services');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SRF_SERVICES_CATALOG[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Event Bus Interactive Simulator State
  const [eventsList, setEventsList] = useState<SrfDomainEvent[]>(SAMPLE_SRF_EVENTS);
  const [newEventTopic, setNewEventTopic] = useState<string>('nexora.core.system');
  const [newEventName, setNewEventName] = useState<string>('cache.purged');
  const [newEventPayload, setNewEventPayload] = useState<string>('{\n  "cacheRegion": "users",\n  "keysPurged": 142\n}');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Feature Flags State
  const [flagsList, setFlagsList] = useState<SrfFeatureFlag[]>(SAMPLE_SRF_FLAGS);
  const [testTenantId, setTestTenantId] = useState<string>('tenant-482');
  const [testUserId, setTestUserId] = useState<string>('usr-992');

  // AI Runtime Simulator State
  const [selectedPromptId, setSelectedPromptId] = useState<string>(SAMPLE_SRF_PROMPTS[0].id);
  const [promptVariables, setPromptVariables] = useState<Record<string, string>>({
    targetLanguage: 'TypeScript',
    codeSnippet: 'const calculateTotal = (items) => items.reduce((acc, item) => acc + item.price, 0);'
  });
  const [aiOutputResult, setAiOutputResult] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Observability Metrics State
  const [systemMetrics, setSystemMetrics] = useState({
    httpRequestsTotal: 142890,
    activeTraceSpans: 42,
    redisMemoryMb: 128.4,
    cacheHitRatio: 94.2,
    livenessStatus: 'HEALTHY',
    readinessStatus: 'HEALTHY'
  });

  const selectedService = SRF_SERVICES_CATALOG.find(s => s.id === selectedServiceId) || SRF_SERVICES_CATALOG[0];
  const selectedPrompt = SAMPLE_SRF_PROMPTS.find(p => p.id === selectedPromptId) || SAMPLE_SRF_PROMPTS[0];

  const handleCopyText = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    onTriggerToast(t('common.copied'), `${title} copied to clipboard`, 'success');
  };

  const handlePublishEvent = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const newEvt: SrfDomainEvent = {
        id: `evt-${Date.now().toString().slice(-4)}`,
        eventName: newEventName,
        topic: newEventTopic,
        publisher: 'SRF Event Bus Simulator',
        payloadJson: newEventPayload,
        correlationId: `tr-${Math.floor(Math.random() * 8999 + 1000)}`,
        timestamp: new Date().toISOString(),
        status: 'DISPATCHED'
      };
      setEventsList(prev => [newEvt, ...prev]);
      setIsPublishing(false);
      onTriggerToast('Event Dispatched', `Published '${newEventName}' to topic '${newEventTopic}'`, 'info');
    }, 400);
  };

  const toggleFlagState = (key: string) => {
    setFlagsList(prev => prev.map(f => {
      if (f.key === key) {
        const next = !f.enabled;
        onTriggerToast('Feature Flag Toggled', `Flag ${key} is now ${next ? 'ENABLED' : 'DISABLED'}`, next ? 'success' : 'warning');
        return { ...f, enabled: next };
      }
      return f;
    }));
  };

  const handleExecuteAiPrompt = () => {
    setIsGeneratingAi(true);
    setAiOutputResult('Connecting to NEXORA AI Runtime (Gemini 2.5 Flash)...');
    setTimeout(() => {
      let output = '';
      if (selectedPromptId === 'prompt_code_explanation') {
        output = `### AI Runtime Execution Result [Model: Gemini 2.5 Flash]
- **Language Analysis**: Target language specified as **${promptVariables.targetLanguage || 'TypeScript'}**.
- **Time Complexity**: **O(N)** linear traversal over items array.
- **Memory Footprint**: **O(1)** auxiliary stack frame.
- **Architectural Suggestion**: Wrap with typed DTO interface to ensure item object contains mandatory \`price\` property.`;
      } else {
        output = `### DDD Entity & DTO Generated
\`\`\`python
from pydantic import BaseModel, Field

class EntityDTO(BaseModel):
    id: str = Field(..., description="Aggregate root UUID")
    status: str = Field(default="ACTIVE")
\`\`\``;
      }
      setAiOutputResult(output);
      setIsGeneratingAi(false);
      onTriggerToast('AI Prompt Executed', 'Response generated via SRF AI Runtime', 'ai');
    }, 800);
  };

  const filteredServices = SRF_SERVICES_CATALOG.filter(service => {
    const matchesCat = categoryFilter === 'ALL' || service.category === categoryFilter;
    const matchesSearch = searchQuery === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      {/* SRF Header Banner */}
      <div className="mb-8 border border-slate-800 rounded-xl bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SRF PHASE 5 MASTER RUNTIME
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                13 SHARED SERVICES ACTIVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                12 PRODUCTS UNIFIED
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono uppercase">
              NEXORA Shared Runtime Foundation (SRF)
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl font-sans">
              Centralized enterprise infrastructure eliminating code duplication across Forge, SDK, Studio, Platform, CORE, Analytics, Mining, Marketplace, SIGS & AI Platform.
            </p>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 shrink-0">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Runtime Dependency Status</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ZERO CIRCULAR DEPENDENCIES
              </span>
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'services'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>13 Shared Services</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'architecture'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Architecture & Layers</span>
          </button>

          <button
            onClick={() => setActiveTab('eventbus')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'eventbus'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Event Bus Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('featureflags')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'featureflags'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Feature Flags Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('airuntime')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'airuntime'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <AiIcon className="w-4 h-4" />
            <span>AI Runtime & RAG</span>
          </button>

          <button
            onClick={() => setActiveTab('observability')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'observability'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Observability Metrics</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 13 SHARED SERVICES CATALOG & SPECIFICATIONS */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Controls & Search Filter Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center mr-2">
                <Filter className="w-3.5 h-3.5 mr-1" /> Category:
              </span>
              {['ALL', 'CORE_PLATFORM', 'SECURITY_GOVERNANCE', 'OBSERVABILITY_DIAGNOSTICS', 'DATA_STORAGE_CACHE', 'AI_RUNTIME_ENGINES', 'INTEGRATION_SCHEDULING'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search runtime services..."
                className="w-full bg-slate-950 text-xs text-slate-200 pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Services Selector List */}
            <div className="lg:col-span-1 space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {filteredServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`w-full text-left rtl:text-right p-3.5 rounded-xl border transition-all cursor-pointer font-mono ${
                    selectedServiceId === service.id
                      ? 'bg-cyan-950/50 border-cyan-500/60 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">{service.code}</span>
                    <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 font-mono">
                      {service.consumers.length} CONSUMERS
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{service.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{service.tagline}</p>
                </button>
              ))}
            </div>

            {/* Right Detailed Specification View */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {selectedService.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                        {selectedService.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-mono text-white">{selectedService.name}</h2>
                    <p className="text-xs text-slate-300 mt-1">{selectedService.tagline}</p>
                  </div>

                  <button
                    onClick={() => onOpenCodeModal(`${selectedService.name} - Interface Spec`, selectedService.interfaces[0]?.codeExample || '', 'typescript')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors flex items-center self-start cursor-pointer"
                  >
                    <Code2 className="w-4 h-4 mr-1.5" />
                    View Interface Code
                  </button>
                </div>

                {/* 1. Responsibilities & Capabilities */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Primary Responsibilities & Capabilities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedService.responsibilities.map((resp, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-200 flex items-start space-x-2 rtl:space-x-reverse">
                        <span className="text-cyan-400 font-bold font-mono mt-0.5">•</span>
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Interfaces & API Signature */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider flex items-center">
                    <Terminal className="w-4 h-4 mr-1.5" /> Core Interfaces & Signatures
                  </h3>
                  <div className="space-y-3">
                    {selectedService.interfaces.map((iface, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-100">{iface.name}</span>
                          <button
                            onClick={() => handleCopyText(iface.codeExample, iface.name)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center"
                          >
                            <Copy className="w-3 h-3 mr-1" /> Copy Code
                          </button>
                        </div>
                        <code className="block bg-slate-900 px-3 py-1.5 rounded text-[11px] text-cyan-300 font-mono border border-slate-800">
                          {iface.signature}
                        </code>
                        <p className="text-xs text-slate-400">{iface.description}</p>
                        <pre className="bg-slate-900 p-3 rounded text-[11px] text-slate-300 font-mono overflow-x-auto leading-relaxed border border-slate-800/60">
                          {iface.codeExample}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Configuration YAML Schema */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center">
                      <Sliders className="w-4 h-4 mr-1.5" /> Configuration Schema (YAML)
                    </h3>
                    <button
                      onClick={() => handleCopyText(selectedService.configurationYaml, 'Configuration YAML')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Copy YAML
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-xl text-xs text-amber-200/90 font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                    {selectedService.configurationYaml}
                  </pre>
                </div>

                {/* 4. Engineering Quality Metrics (Testing, Security, Performance, Error Handling) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center font-mono uppercase">
                      <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Security Considerations
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {selectedService.securityConsiderations.map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-sky-400 flex items-center font-mono uppercase">
                      <Activity className="w-3.5 h-3.5 mr-1.5" /> Performance & SLA
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {selectedService.performanceConsiderations.map((perf, i) => (
                        <li key={i}>{perf}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 5. Product Consumer Attachment Matrix */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h3 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider flex items-center">
                    <Box className="w-4 h-4 mr-1.5 text-cyan-400" /> Attached Product Consumers ({selectedService.consumers.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedService.consumers.map((consumer, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{consumer.productName}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                              consumer.status === 'CORE_DEPENDENCY' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            }`}>
                              {consumer.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{consumer.usageDescription}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE & LAYERS */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-mono text-white">NEXORA Shared Runtime Foundation (SRF) Stack</h2>
              <p className="text-xs text-slate-400 mt-1">
                Strict unidirectional dependency flow. Upper product layers consume lower runtime layers. Circular dependencies are enforced as compile errors.
              </p>
            </div>

            <div className="space-y-4">
              {SRF_ARCHITECTURE_LAYERS.map((layer) => (
                <div
                  key={layer.id}
                  className="bg-slate-950 p-5 rounded-xl border border-slate-800 relative overflow-hidden"
                  style={{ borderLeftColor: layer.color, borderLeftWidth: '6px' }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-sm font-bold font-mono text-white" style={{ color: layer.color }}>
                        {layer.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">{layer.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">{layer.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {layer.services.map((svc, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-slate-900 text-xs font-mono text-slate-200 border border-slate-800"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVENT BUS SIMULATOR */}
      {activeTab === 'eventbus' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Publisher Form */}
            <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 font-mono">
              <h3 className="text-sm font-bold text-white flex items-center">
                <Radio className="w-4 h-4 mr-2 text-emerald-400" /> Publish Domain Event
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Topic Name</label>
                  <input
                    type="text"
                    value={newEventTopic}
                    onChange={e => setNewEventTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-emerald-300 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Event Name</label>
                  <input
                    type="text"
                    value={newEventName}
                    onChange={e => setNewEventName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-emerald-300 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Event Payload (JSON)</label>
                  <textarea
                    value={newEventPayload}
                    onChange={e => setNewEventPayload(e.target.value)}
                    rows={6}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <button
                  onClick={handlePublishEvent}
                  disabled={isPublishing}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <Play className="w-3.5 h-3.5 mr-2 fill-white" />
                  {isPublishing ? 'Publishing...' : 'Dispatch to Event Bus'}
                </button>
              </div>
            </div>

            {/* Live Event Stream */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold font-mono text-white flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-emerald-400" /> Live Event Bus Stream
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  REDIS DISPATCHER READY
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {eventsList.map((evt) => (
                  <div key={evt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-emerald-400">{evt.eventName}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {evt.topic}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center space-x-4">
                      <span>Publisher: {evt.publisher}</span>
                      <span>Correlation ID: {evt.correlationId}</span>
                    </div>

                    <pre className="bg-slate-900 p-2.5 rounded text-[11px] text-slate-300 font-mono overflow-x-auto border border-slate-800/80">
                      {evt.payloadJson}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE FLAGS ENGINE */}
      {activeTab === 'featureflags' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 font-mono">
            <div>
              <h2 className="text-xl font-bold text-white">Feature Flag Evaluation Engine</h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time tenant, percentage rollout, and environment rule evaluator.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flagsList.map((flag) => (
                <div key={flag.key} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{flag.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">{flag.key}</span>
                    </div>
                    <button
                      onClick={() => toggleFlagState(flag.key)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        flag.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {flag.enabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">{flag.description}</p>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Type: {flag.type}
                    </span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Rollout: {flag.rolloutPercentage}%
                    </span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Rule: {flag.environmentRule}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AI RUNTIME & RAG */}
      {activeTab === 'airuntime' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
            {/* Prompt Registry */}
            <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center">
                <AiIcon className="w-4 h-4 mr-2 text-purple-400" /> Managed Prompt Registry
              </h3>

              <div className="space-y-2">
                {SAMPLE_SRF_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => setSelectedPromptId(prompt.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedPromptId === prompt.id
                        ? 'bg-purple-950/60 border-purple-500/60 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{prompt.name}</span>
                      <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded text-purple-300">
                        v{prompt.version}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">{prompt.provider}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 block">Template Input Variables</label>
                {selectedPrompt.variables.map((varName) => (
                  <div key={varName}>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{varName}</label>
                    <input
                      type="text"
                      value={promptVariables[varName] || ''}
                      onChange={e => setPromptVariables({ ...promptVariables, [varName]: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-purple-200 outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                ))}

                <button
                  onClick={handleExecuteAiPrompt}
                  disabled={isGeneratingAi}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-lg shadow-purple-600/20"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  {isGeneratingAi ? 'Executing Prompt...' : 'Run Managed Prompt'}
                </button>
              </div>
            </div>

            {/* AI Output Canvas */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-400" /> AI Runtime Execution Response
                </h3>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  GEMINI 2.5 FLASH CONNECTED
                </span>
              </div>

              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 min-h-[350px] space-y-4">
                {aiOutputResult ? (
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-mono">
                    {aiOutputResult}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 py-12 text-center">
                    Select a prompt template and click "Run Managed Prompt" to execute via SRF AI Runtime.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: OBSERVABILITY METRICS */}
      {activeTab === 'observability' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total HTTP Requests</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{systemMetrics.httpRequestsTotal.toLocaleString()}</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Active Trace Spans</span>
              <div className="text-2xl font-bold text-purple-400 mt-1">{systemMetrics.activeTraceSpans}</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Redis L2 Cache Hit Ratio</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{systemMetrics.cacheHitRatio}%</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Liveness / Readiness</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{systemMetrics.livenessStatus}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
