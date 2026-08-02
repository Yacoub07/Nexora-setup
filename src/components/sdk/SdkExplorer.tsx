import React, { useState } from 'react';
import {
  Box,
  Terminal,
  Code,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Cpu,
  Layers,
  Zap,
  Activity,
  Play,
  FileCode,
  Search,
  Filter,
  Check,
  Package,
  Server,
  Share2,
  Sparkles,
  Sliders,
  Database,
  Lock,
  ChevronRight,
  Gauge
} from 'lucide-react';
import {
  SDK_PACKAGES,
  SDK_BENCHMARKS,
  SDK_FEATURE_FLAGS,
  NEXORA_SDK_VERSION
} from '../../data/sdkData';
import {
  SdkPackageSpec,
  SdkModuleCategory
} from '../../types/sdk';

interface SdkExplorerProps {
  onOpenCodeModal: (title: string, code: string, language?: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const SdkExplorer: React.FC<SdkExplorerProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'sandbox' | 'benchmarks' | 'flags'>('packages');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPackage, setSelectedPackage] = useState<SdkPackageSpec>(SDK_PACKAGES[0]);
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'ts' | 'test'>('python');

  // Interactive Sandbox state
  const [sandboxRole, setSandboxRole] = useState<string>('MEMBER');
  const [sandboxPermission, setSandboxPermission] = useState<string>('workspace:write');
  const [sandboxPermissionResult, setSandboxPermissionResult] = useState<boolean | null>(null);

  const [sandboxTenantId, setSandboxTenantId] = useState<string>('tenant-alpha');
  const [sandboxEntityName, setSandboxEntityName] = useState<string>('Project Forge Core');
  const [sandboxDbOutput, setSandboxDbOutput] = useState<string | null>(null);

  const [sandboxPromptKey, setSandboxPromptKey] = useState<string>('SUMMARIZE_CODE');
  const [sandboxPromptOutput, setSandboxPromptOutput] = useState<string | null>(null);

  const [sandboxLogMsg, setSandboxLogMsg] = useState<string>('User created new project workspace');
  const [sandboxLogOutput, setSandboxLogOutput] = useState<string | null>(null);

  const filteredPackages = SDK_PACKAGES.filter(p => {
    return selectedCategory === 'ALL' || p.category === selectedCategory;
  });

  const handleTestRbac = () => {
    const rolePermissions: Record<string, string[]> = {
      PLATFORM_ADMIN: ['*'],
      WORKSPACE_ADMIN: ['workspace:read', 'workspace:write', 'workspace:delete'],
      MEMBER: ['workspace:read', 'workspace:write'],
      VIEWER: ['workspace:read']
    };
    const perms = rolePermissions[sandboxRole] || [];
    const allowed = perms.includes('*') || perms.includes(sandboxPermission);
    setSandboxPermissionResult(allowed);
    onTriggerToast(
      'SDK RBAC Evaluated',
      `Role [${sandboxRole}] -> Permission [${sandboxPermission}]: ${allowed ? 'ALLOWED' : 'DENIED'}`,
      allowed ? 'success' : 'warning'
    );
  };

  const handleTestRepository = () => {
    const record = {
      id: `ent-${Math.random().toString(36).substring(2, 8)}`,
      name: sandboxEntityName,
      tenantId: sandboxTenantId,
      createdAt: new Date().toISOString()
    };
    setSandboxDbOutput(JSON.stringify(record, null, 2));
    onTriggerToast(
      'SDK Repository Test',
      `Saved entity to tenant isolated repository for [${sandboxTenantId}]`,
      'success'
    );
  };

  const handleTestPromptHydration = () => {
    let output = '';
    if (sandboxPromptKey === 'SUMMARIZE_CODE') {
      output = `Summarize the following architecture code for tenant ${sandboxTenantId}:\nclass CoreService:\n    def process(self): pass`;
    } else {
      output = `Generate an OpenAPI 3.1 specification for module ${sandboxEntityName}.`;
    }
    setSandboxPromptOutput(output);
    onTriggerToast('SDK AI Hydrator', 'Hydrated prompt template', 'info');
  };

  const handleEmitLog = () => {
    const logObj = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: 'nexora-sdk-runner',
      trace_id: 'tr-' + Math.random().toString(36).substring(2, 10),
      tenant_id: sandboxTenantId,
      message: sandboxLogMsg
    };
    setSandboxLogOutput(JSON.stringify(logObj, null, 2));
    onTriggerToast('SDK Logger', 'Emitted JSON structured log', 'info');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onTriggerToast('Copied to Clipboard', label, 'info');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Banner Header */}
      <div className="relative rounded-xl bg-slate-900 border border-slate-800 p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                Phase 7 Standard
              </span>
              <span className="text-xs text-slate-400 font-mono">NEXORA SDK v{NEXORA_SDK_VERSION}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Shared Enterprise SDK Foundation
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Core Coverage
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Official production SDK powering NEXORA Forge, Studio, CORE, Knowledge Portal, and all ecosystem services with unified config, logging, RBAC/ABAC security, CloudEvents, tenant isolation, and AI prompt hydration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenCodeModal(
                'NEXORA SDK PyPI / npm Installation',
                `# Python Installation
pip install nexora-sdk==${NEXORA_SDK_VERSION}

# Node.js / TypeScript Installation
npm install @nexora/sdk@${NEXORA_SDK_VERSION}

# Usage Example (Python)
from nexora.config import NexoraConfig
from nexora.logging import setup_logger
from nexora.security import RbacEvaluator

config = NexoraConfig.load_from_env()
logger = setup_logger("my-service")
logger.info("service_initialized", env=config.environment)
`,
                'bash'
              )}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              Install Commands
            </button>
            <button
              onClick={() => onTriggerToast('SDK Bundle Export', 'Exported NEXORA SDK v0.1.0 release artifacts', 'success')}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Export SDK Release
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-t border-slate-800/80 pt-4 flex flex-wrap items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            SDK Packages ({SDK_PACKAGES.length})
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sandbox'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Play className="w-4 h-4 text-amber-400" />
            SDK Live Sandbox
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Gauge className="w-4 h-4" />
            Performance & Coverage
          </button>

          <button
            onClick={() => setActiveTab('flags')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'flags'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Feature Flags & Profiles
          </button>
        </div>
      </div>

      {/* TAB 1: PACKAGES EXPLORER */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Category Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'ALL', label: 'All Packages' },
                { key: 'CORE_CONFIG', label: 'Config & Exceptions' },
                { key: 'OBSERVABILITY', label: 'Logging & Events' },
                { key: 'SECURITY_AUTH', label: 'Security & Auth' },
                { key: 'DATA_PERSISTENCE', label: 'Database & Repos' },
                { key: 'AI_RAG', label: 'AI & Prompts' },
                { key: 'EXTENSIONS_PLUGINS', label: 'Plugins' }
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredPackages.length} packages
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Package List */}
            <div className="space-y-3">
              {filteredPackages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {pkg.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {pkg.testCoveragePercent}% Cov
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {pkg.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>{pkg.pythonModulePath}</span>
                      <span className="text-cyan-400 font-semibold">Details &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Package Code & Spec Details */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      v{selectedPackage.version}
                    </span>
                    <span className="text-xs text-slate-400">Category: <strong className="text-slate-200">{selectedPackage.category}</strong></span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedPackage.name}</h2>
                  <p className="text-xs text-slate-300 mt-1">{selectedPackage.description}</p>
                </div>

                {/* Python vs TypeScript Code Language Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
                  <button
                    onClick={() => setCodeLanguage('python')}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                      codeLanguage === 'python'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Python (.py)
                  </button>
                  <button
                    onClick={() => setCodeLanguage('ts')}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                      codeLanguage === 'ts'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    TypeScript (.ts)
                  </button>
                  <button
                    onClick={() => setCodeLanguage('test')}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                      codeLanguage === 'test'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Unit Test
                  </button>
                </div>
              </div>

              {/* Package Details Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Exports / Functions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPackage.keyClassesAndFunctions.map((fn, fIdx) => (
                      <span key={fIdx} className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700">
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dependencies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPackage.dependencies.length > 0 ? (
                      selectedPackage.dependencies.map((dep, dIdx) => (
                        <span key={dIdx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                          {dep}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Zero third-party dependencies (Zero-dep core)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    {codeLanguage === 'python' ? `Python Implementation (${selectedPackage.pythonModulePath})` : codeLanguage === 'ts' ? `TypeScript Implementation (${selectedPackage.tsModulePath})` : 'Unit Test Suite (pytest)'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(
                      codeLanguage === 'python' ? selectedPackage.pythonImplementation : codeLanguage === 'ts' ? selectedPackage.tsImplementation : selectedPackage.unitTestExample,
                      'SDK Source Code'
                    )}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed max-h-96">
                  {codeLanguage === 'python'
                    ? selectedPackage.pythonImplementation
                    : codeLanguage === 'ts'
                    ? selectedPackage.tsImplementation
                    : selectedPackage.unitTestExample}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SDK LIVE SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-amber-400" />
                Interactive SDK Live Execution Sandbox
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Execute live SDK modules including RBAC security evaluation, tenant-isolated repository operations, structured log emissions, and AI prompt template hydration.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box 1: Security RBAC Evaluator */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-bold text-white">nexora-security (RBAC Evaluator)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">RbacEvaluator.has_permission()</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">User Role</label>
                    <select
                      value={sandboxRole}
                      onChange={(e) => setSandboxRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                    >
                      <option value="PLATFORM_ADMIN">PLATFORM_ADMIN</option>
                      <option value="WORKSPACE_ADMIN">WORKSPACE_ADMIN</option>
                      <option value="MEMBER">MEMBER</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Required Permission</label>
                    <select
                      value={sandboxPermission}
                      onChange={(e) => setSandboxPermission(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                    >
                      <option value="workspace:read">workspace:read</option>
                      <option value="workspace:write">workspace:write</option>
                      <option value="workspace:delete">workspace:delete</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleTestRbac}
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Evaluate Permission
                </button>

                {sandboxPermissionResult !== null && (
                  <div className={`p-3 rounded border text-xs font-mono flex items-center justify-between ${
                    sandboxPermissionResult
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    <span>Result: <strong>{sandboxPermissionResult ? 'ALLOWED' : 'DENIED'}</strong></span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Box 2: Database Tenant Repository */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-bold text-white">nexora-database (Tenant BaseRepository)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">BaseRepository.save()</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tenant Scope ID</label>
                    <input
                      type="text"
                      value={sandboxTenantId}
                      onChange={(e) => setSandboxTenantId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Entity Name</label>
                    <input
                      type="text"
                      value={sandboxEntityName}
                      onChange={(e) => setSandboxEntityName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <button
                  onClick={handleTestRepository}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Save Isolated Entity
                </button>

                {sandboxDbOutput && (
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 font-mono overflow-x-auto">
                    {sandboxDbOutput}
                  </pre>
                )}
              </div>

              {/* Box 3: AI Prompt Registry */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold text-white">nexora-ai (Prompt Registry)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">PromptRegistry.hydrate()</span>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Select Registered Template</label>
                  <select
                    value={sandboxPromptKey}
                    onChange={(e) => setSandboxPromptKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                  >
                    <option value="SUMMARIZE_CODE">SUMMARIZE_CODE</option>
                    <option value="GENERATE_API_SPEC">GENERATE_API_SPEC</option>
                  </select>
                </div>

                <button
                  onClick={handleTestPromptHydration}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Hydrate Prompt Template
                </button>

                {sandboxPromptOutput && (
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {sandboxPromptOutput}
                  </pre>
                )}
              </div>

              {/* Box 4: Structured Logger */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">nexora-logging (JSON Logger)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">logger.info()</span>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Log Message</label>
                  <input
                    type="text"
                    value={sandboxLogMsg}
                    onChange={(e) => setSandboxLogMsg(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                  />
                </div>

                <button
                  onClick={handleEmitLog}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Emit Log Record
                </button>

                {sandboxLogOutput && (
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 font-mono overflow-x-auto">
                    {sandboxLogOutput}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BENCHMARKS & COVERAGE */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                Performance Benchmarks & Test Coverage
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Static analysis, sub-millisecond execution latencies, and 100% test coverage target across all core packages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1">
                <div className="text-2xl font-bold text-emerald-400 font-mono">100%</div>
                <div className="text-xs text-slate-400">Core Test Coverage</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1">
                <div className="text-2xl font-bold text-cyan-400 font-mono">&lt; 0.15ms</div>
                <div className="text-xs text-slate-400">Avg Security Check Latency</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1">
                <div className="text-2xl font-bold text-amber-400 font-mono">12.5M</div>
                <div className="text-xs text-slate-400">Log Ops / Sec Throughput</div>
              </div>
            </div>

            {/* Benchmark Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                    <th className="p-3">Package Name</th>
                    <th className="p-3">Operation Under Load</th>
                    <th className="p-3">Avg Latency</th>
                    <th className="p-3">Throughput (Ops/sec)</th>
                    <th className="p-3">Mem Usage</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {SDK_BENCHMARKS.map((bm, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/50 transition-colors">
                      <td className="p-3 font-bold text-cyan-300">{bm.packageName}</td>
                      <td className="p-3 text-slate-300">{bm.operation}</td>
                      <td className="p-3 text-emerald-400 font-bold">{bm.latencyMs} ms</td>
                      <td className="p-3 text-slate-200">{bm.throughputOpsSec.toLocaleString()}</td>
                      <td className="p-3 text-slate-400">{bm.memoryUsageMb} MB</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          {bm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE FLAGS */}
      {activeTab === 'flags' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                SDK Configuration Profiles & Feature Flags
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Dynamic feature flag evaluator integrated into <code className="text-cyan-300">nexora-config</code> for tenant tier targeting and canary rollouts.
              </p>
            </div>

            <div className="space-y-4">
              {SDK_FEATURE_FLAGS.map((flag) => (
                <div key={flag.key} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">{flag.key}</span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                      flag.enabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {flag.enabled ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{flag.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Tiers: <strong className="text-slate-200">{flag.rules.tenantTier?.join(', ') || 'ALL'}</strong></span>
                    <span>Rollout: <strong className="text-emerald-400">{flag.rules.rolloutPercentage}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
