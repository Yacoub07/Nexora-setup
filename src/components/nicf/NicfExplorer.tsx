import React, { useState } from 'react';
import {
  Network,
  Radio,
  Zap,
  Globe,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Copy,
  Code,
  Share2,
  Key,
  FileText,
  Search,
  Filter,
  Workflow,
  Play,
  Send,
  Activity,
  ChevronRight,
  Boxes,
  Lock,
  Building2,
  Server,
  RefreshCw,
  AlertTriangle,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  NICF_COMMUNICATION_MODELS,
  API_GOVERNANCE_POLICIES,
  NICF_EVENT_CATALOG,
  NICF_EXTERNAL_CONNECTORS,
  NICF_CONTRACT_STANDARDS
} from '../../data/nicfData';
import {
  CommunicationModelSpec,
  NicfCatalogEvent,
  NicfExternalConnector
} from '../../types/nicf';

interface NicfExplorerProps {
  onOpenCodeModal: (title: string, code: string, language?: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const NicfExplorer: React.FC<NicfExplorerProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'models' | 'governance' | 'events' | 'discovery' | 'connectors' | 'contracts'>('models');
  
  // Model selection state
  const [selectedModel, setSelectedModel] = useState<CommunicationModelSpec>(NICF_COMMUNICATION_MODELS[0]);

  // Event Catalog selection & search state
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<NicfCatalogEvent>(NICF_EVENT_CATALOG[0]);
  const [simulatedDispatchStatus, setSimulatedDispatchStatus] = useState<string | null>(null);

  // Connector selection & filter state
  const [connectorCategory, setConnectorCategory] = useState<string>('ALL');
  const [selectedConnector, setSelectedConnector] = useState<NicfExternalConnector>(NICF_EXTERNAL_CONNECTORS[0]);

  // Service Discovery topology state
  const [activeEnv, setActiveEnv] = useState<'local' | 'docker' | 'k8s' | 'cloud'>('k8s');

  // RFC 7807 Error tester inputs
  const [errorStatus, setErrorStatus] = useState<number>(422);
  const [errorDetail, setErrorDetail] = useState<string>('Workspace manifest validation failed: property "version" is required');

  const filteredEvents = NICF_EVENT_CATALOG.filter(e => {
    const matchesSearch = e.eventName.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
                          e.topic.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
                          e.publisherService.toLowerCase().includes(eventSearchTerm.toLowerCase());
    const matchesCategory = eventCategoryFilter === 'ALL' || e.category === eventCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredConnectors = NICF_EXTERNAL_CONNECTORS.filter(c => {
    return connectorCategory === 'ALL' || c.category === connectorCategory;
  });

  const handleSimulateEventDispatch = () => {
    setSimulatedDispatchStatus('Publishing CloudEvent...');
    setTimeout(() => {
      setSimulatedDispatchStatus(`Event [${selectedEvent.eventName}] published successfully to topic: ${selectedEvent.topic}`);
      onTriggerToast(
        'Event Bus Dispatch',
        `Dispatched ${selectedEvent.eventName} to topic '${selectedEvent.topic}'`,
        'success'
      );
    }, 600);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onTriggerToast('Copied to Clipboard', label, 'info');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Section */}
      <div className="relative rounded-xl bg-slate-900 border border-slate-800 p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                Phase 6 Standard
              </span>
              <span className="text-xs text-slate-400 font-mono">v1.0.0 Spec</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              NEXORA Integration & Communication Framework
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active Protocol
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Unified communication architecture defining external REST/GraphQL interfaces, internal gRPC services, asynchronous CloudEvents event bus topology, external enterprise connectors, and strict API governance standards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenCodeModal(
                'NICF Full Specification JSON',
                JSON.stringify({
                  framework: 'NEXORA Integration & Communication Framework (NICF)',
                  version: '1.0.0',
                  communicationModels: NICF_COMMUNICATION_MODELS,
                  apiGovernance: API_GOVERNANCE_POLICIES,
                  eventCatalogCount: NICF_EVENT_CATALOG.length,
                  externalConnectorsCount: NICF_EXTERNAL_CONNECTORS.length
                }, null, 2),
                'json'
              )}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Code className="w-4 h-4 text-cyan-400" />
              View Spec JSON
            </button>
            <button
              onClick={() => {
                onTriggerToast('NICF Export', 'Exported NICF OpenAPI 3.1 & AsyncAPI 3.0 bundle', 'success');
              }}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Export AsyncAPI & OpenAPI Bundle
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-t border-slate-800/80 pt-4 flex flex-wrap items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'models'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            Communication Models
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'governance'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            API Governance & Error Model
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'events'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Event Catalog ({NICF_EVENT_CATALOG.length})
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'discovery'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Service Discovery & Mesh
          </button>

          <button
            onClick={() => setActiveTab('connectors')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'connectors'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            External Connectors ({NICF_EXTERNAL_CONNECTORS.length})
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'contracts'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Contract Standards & Security
          </button>
        </div>
      </div>

      {/* TAB 1: COMMUNICATION MODELS */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NICF_COMMUNICATION_MODELS.map((model) => {
              const isSelected = selectedModel.id === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {model.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Activity className="w-3 h-3 text-emerald-400" />
                      {model.latencyExpectation}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{model.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {model.primaryUseCase}
                  </p>
                  <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-3">
                    <span className="text-slate-300 font-mono">{model.protocol}</span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      Inspect Rules
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Communication Model Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {selectedModel.type}
                  </span>
                  <span className="text-xs text-slate-400">Protocol: <strong className="text-slate-200">{selectedModel.protocol}</strong></span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedModel.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenCodeModal(`${selectedModel.name} Code Example`, selectedModel.codeExample, 'typescript')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  Expand Snippet
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Governance Rules */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Mandatory Governance Rules
                </h4>
                <div className="space-y-2.5">
                  {selectedModel.governanceRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-slate-300">Payload & Data Specification</div>
                  <div className="text-xs text-slate-400 font-mono">{selectedModel.payloadFormat}</div>
                </div>
              </div>

              {/* Right Column: Code Example */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Protocol Code Pattern
                  </h4>
                  <button
                    onClick={() => copyToClipboard(selectedModel.codeExample, 'Code Pattern')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed max-h-96">
                  {selectedModel.codeExample}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: API GOVERNANCE & RFC 7807 */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {API_GOVERNANCE_POLICIES.map((policy, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">{policy.standard}</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{policy.topic}</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Governing Rules</h4>
                  <ul className="space-y-2">
                    {policy.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <pre className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto">
                    {policy.exampleSnippet}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* RFC 7807 Problem Details Interactive Tester Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  RFC 7807 Error Model
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Interactive Problem Details Response Generator</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Content-Type: application/problem+json</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">HTTP Status Code</label>
                  <select
                    value={errorStatus}
                    onChange={(e) => setErrorStatus(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    <option value={400}>400 - Bad Request</option>
                    <option value={401}>401 - Unauthorized (JWT Missing/Expired)</option>
                    <option value={403}>403 - Forbidden (Insufficient Scope)</option>
                    <option value={404}>404 - Resource Not Found</option>
                    <option value={422}>422 - Unprocessable Entity (Validation Error)</option>
                    <option value={429}>429 - Rate Limit Exceeded</option>
                    <option value={500}>500 - Internal Platform Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Error Detail Message</label>
                  <input
                    type="text"
                    value={errorDetail}
                    onChange={(e) => setErrorDetail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-slate-300">NICF Compliance Guarantee</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    RFC 7807 guarantees structured error responses across all NEXORA services, enabling automated client error handling without fragile text parsing.
                  </p>
                </div>
              </div>

              {/* Response Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">Generated RFC 7807 Payload</span>
                  <button
                    onClick={() => copyToClipboard(
                      JSON.stringify({
                        type: `https://errors.nexora.io/code-${errorStatus}`,
                        title: errorStatus === 422 ? 'Validation Error' : 'API Error',
                        status: errorStatus,
                        detail: errorDetail,
                        instance: '/v1/workspaces/validate',
                        trace_id: 'tr-' + Math.random().toString(36).substring(2, 10),
                        timestamp: new Date().toISOString()
                      }, null, 2),
                      'RFC 7807 Error JSON'
                    )}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Payload
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">
                  {JSON.stringify({
                    type: `https://errors.nexora.io/code-${errorStatus}`,
                    title: errorStatus === 422 ? 'Validation Error' : 'API Error',
                    status: errorStatus,
                    detail: errorDetail,
                    instance: '/v1/workspaces/validate',
                    trace_id: 'tr-' + Math.random().toString(36).substring(2, 10),
                    timestamp: new Date().toISOString()
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVENT CATALOG & PAYLOAD INSPECTOR */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events by name, topic, or publisher..."
                  value={eventSearchTerm}
                  onChange={(e) => setEventSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={eventCategoryFilter}
                  onChange={(e) => setEventCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="IDENTITY_TENANCY">Identity & Tenancy</option>
                  <option value="WORKSPACE_BUILD">Workspace Build</option>
                  <option value="EXTENSIONS">Extensions & Marketplace</option>
                  <option value="KNOWLEDGE_AI">Knowledge & AI</option>
                  <option value="PLATFORM_OPS">Platform Ops</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredEvents.length} of {NICF_EVENT_CATALOG.length} events
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Event List */}
            <div className="space-y-3">
              {filteredEvents.map((evt) => {
                const isSelected = selectedEvent.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedEvent(evt);
                      setSimulatedDispatchStatus(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        {evt.eventName}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {evt.category}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono truncate mb-2">
                      {evt.topic}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Pub: <strong className="text-slate-300">{evt.publisherService}</strong></span>
                      <span className="text-slate-400">{evt.subscriberServices.length} Subscribers</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Event Detail Inspector */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      CloudEvents v1.0
                    </span>
                    <span className="text-xs text-slate-400">Owner: <strong className="text-slate-200">{selectedEvent.ownerTeam}</strong></span>
                  </div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedEvent.eventName}
                  </h2>
                  <div className="text-xs text-cyan-400 font-mono mt-1">
                    Topic: {selectedEvent.topic}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateEventDispatch}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Simulate Event Dispatch
                  </button>
                </div>
              </div>

              {simulatedDispatchStatus && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{simulatedDispatchStatus}</span>
                </div>
              )}

              {/* Publisher & Subscribers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Publisher Service</div>
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedEvent.publisherService}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subscriber Services</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.subscriberServices.map((sub, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs border border-slate-700">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payload Schema & Sample Payload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">JSON Schema Draft 2020-12</span>
                    <button
                      onClick={() => copyToClipboard(selectedEvent.payloadSchemaJson, 'JSON Schema')}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Copy Schema
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono overflow-x-auto max-h-64">
                    {selectedEvent.payloadSchemaJson}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sample Payload</span>
                    <button
                      onClick={() => copyToClipboard(selectedEvent.examplePayloadJson, 'Sample Payload')}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Copy Payload
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono overflow-x-auto max-h-64">
                    {selectedEvent.examplePayloadJson}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE DISCOVERY & MESH */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  Service Discovery & Service Mesh Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dynamic registration, Envoy sidecar proxies, mTLS identity verification, and DNS routing across deployment targets.
                </p>
              </div>

              {/* Deployment Target Toggle */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['local', 'docker', 'k8s', 'cloud'] as const).map((env) => (
                  <button
                    key={env}
                    onClick={() => setActiveEnv(env)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeEnv === env
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {env.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Environment Specific Discovery Architecture */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  Target: {activeEnv === 'local' ? 'Local Development (mDNS / Hosts)' : activeEnv === 'docker' ? 'Docker Compose Network' : activeEnv === 'k8s' ? 'Kubernetes CoreDNS & Istio Service Mesh' : 'Global Cloud Edge & Consul'}
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Health Probes: 100% Passing
                </span>
              </div>

              {/* Topology Visual Box */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-center space-y-2">
                  <Globe className="w-6 h-6 text-cyan-400 mx-auto" />
                  <div className="text-xs font-bold text-white">Ingress Gateway</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {activeEnv === 'k8s' ? 'Istio Ingress (Port 443)' : 'Nginx Proxy (Port 3000)'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">TLS 1.3 Terminated</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-center space-y-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-400 mx-auto" />
                  <div className="text-xs font-bold text-white">Envoy Sidecar</div>
                  <div className="text-[11px] text-slate-400 font-mono">mTLS SPIFFE Certificate</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Strict Peer Authentication</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-center space-y-2">
                  <Server className="w-6 h-6 text-emerald-400 mx-auto" />
                  <div className="text-xs font-bold text-white">Service Pods</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {activeEnv === 'k8s' ? 'CoreDNS: auth.nexora.svc' : 'localhost:8080'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">Auto-Scale Ready</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-center space-y-2">
                  <Radio className="w-6 h-6 text-amber-400 mx-auto" />
                  <div className="text-xs font-bold text-white">Control Plane</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {activeEnv === 'k8s' ? 'Istiod / Kubernetes CRD' : 'Consul Sync'}
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">Live Topology Sync</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Discovery Protocol Rules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Dynamic DNS resolution with 5s TTL to prevent stale IP routing.</span>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automatic Outlier Detection removes unhealthy service pods after 3 consecutive 5xx errors.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXTERNAL CONNECTORS CATALOG */}
      {activeTab === 'connectors' && (
        <div className="space-y-6">
          {/* Connector Category Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'ALL', label: 'All Connectors' },
                { key: 'WORKPLACE_SUITE', label: 'Workplace Suites' },
                { key: 'DEVOPS_VCS', label: 'DevOps & VCS' },
                { key: 'ENTERPRISE_ERP', label: 'Enterprise ERP' },
                { key: 'IDENTITY_DIRECTORY', label: 'Directory Services' },
                { key: 'COMMUNICATION', label: 'Messaging & Comms' }
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setConnectorCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    connectorCategory === cat.key
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {filteredConnectors.length} Connectors Available
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Connector Cards */}
            <div className="space-y-3">
              {filteredConnectors.map((conn) => {
                const isSelected = selectedConnector.id === conn.id;
                return (
                  <div
                    key={conn.id}
                    onClick={() => setSelectedConnector(conn)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {conn.authMethod}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {conn.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">{conn.name}</h3>
                    <p className="text-xs text-slate-400 font-mono truncate mb-2">{conn.protocol}</p>

                    <div className="text-[11px] text-emerald-400 pt-2 border-t border-slate-800/80">
                      Rate Limit: {conn.rateLimitSpecs}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Selected Connector Details */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {selectedConnector.authMethod} Auth
                    </span>
                    <span className="text-xs text-slate-400">Category: <strong className="text-slate-200">{selectedConnector.category}</strong></span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedConnector.name}</h2>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedConnector.protocol}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(selectedConnector.sampleConfigYaml, 'Connector Config YAML')}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Config YAML
                  </button>
                </div>
              </div>

              {/* Reusable Capabilities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Out-of-the-Box Connector Capabilities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {selectedConnector.reusableCapabilities.map((cap, capIdx) => (
                    <div key={capIdx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Config YAML Spec */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Vault-Backed Connector Manifest (YAML)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Secrets references resolve via HashiCorp Vault
                  </span>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">
                  {selectedConnector.sampleConfigYaml}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CONTRACT STANDARDS & SECURITY */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {NICF_CONTRACT_STANDARDS.map((contract, cIdx) => (
              <div key={cIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold">v{contract.version}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{contract.standardName}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Target: {contract.targetMedium}</div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linter Governance Rules</h4>
                  <ul className="space-y-2">
                    {contract.linterRules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <pre className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-[11px] text-slate-300 font-mono overflow-x-auto max-h-48">
                    {contract.sampleSpec}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* Zero Trust & Observability Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Lock className="w-5 h-5 text-indigo-400" />
              Zero Trust Security & Distributed Observability Standard
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">mTLS & SPIFFE Identity Propagation</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every microservice call within NEXORA presents a SPIFFE ID certificate (<code className="text-cyan-300">spiffe://nexora.internal/ns/core/sa/service-name</code>). Plain HTTP or unauthenticated traffic is blocked at the sidecar level.
                </p>
              </div>

              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">W3C Trace Context Propagation</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All requests across REST, gRPC, and Kafka events MUST propagate the <code className="text-cyan-300">traceparent</code> header (e.g. <code className="text-slate-400">00-4bf92f35...-01</code>) ensuring end-to-end trace correlation in Jaeger/OpenTelemetry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
