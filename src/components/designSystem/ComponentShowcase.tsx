import React, { useState } from 'react';
import {
  Play,
  RotateCw,
  Search,
  Sliders,
  Check,
  X,
  AlertTriangle,
  Info,
  Sparkles,
  Bot,
  Copy,
  ChevronRight,
  Filter,
  Download,
  Terminal,
  Activity,
  Layers,
  FileCode,
  ShieldAlert,
  HelpCircle,
  Database,
  ArrowUpRight,
  User,
  Clock,
  MoreVertical
} from 'lucide-react';

interface ComponentShowcaseProps {
  onOpenCodeModal: (title: string, code: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<
    'controls' | 'forms' | 'datagrid' | 'charts' | 'timeline' | 'ai' | 'states'
  >('controls');

  // Form states for demo
  const [inputText, setInputText] = useState('nexora-core-node-01');
  const [toggleState, setToggleState] = useState(true);
  const [sliderVal, setSliderVal] = useState(75);
  const [selectedRadio, setSelectedRadio] = useState('prod');

  // Data grid state
  const [tableSearch, setTableSearch] = useState('');
  const [tableSort, setTableSort] = useState<'asc' | 'desc'>('asc');

  // Modal demo state
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // AI prompt demo state
  const [aiPrompt, setAiPrompt] = useState('Optimize the NEXORA CORE RPC router pipeline for sub-millisecond throughput');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const mockDataGrid = [
    { id: 'SRV-8902', name: 'NEXORA CORE RPC Gateway', type: 'Microservice', status: 'HEALTHY', latency: '1.2ms', memory: '1.4 GB', region: 'us-east-1' },
    { id: 'SRV-8903', name: 'NEXORA Mining Pipeline Stream', type: 'ETL Engine', status: 'HEALTHY', latency: '4.8ms', memory: '8.2 GB', region: 'eu-west-1' },
    { id: 'SRV-8904', name: 'NEXORA SIGS Anomaly Detector', type: 'Event Stream', status: 'WARNING', latency: '18.4ms', memory: '4.1 GB', region: 'us-west-2' },
    { id: 'SRV-8905', name: 'NEXORA AI Agent Orchestrator', type: 'Inference', status: 'HEALTHY', latency: '2.1ms', memory: '16.0 GB', region: 'ap-southeast-1' },
    { id: 'SRV-8906', name: 'NEXORA Knowledge Vector Store', type: 'Database', status: 'HEALTHY', latency: '0.8ms', memory: '32.4 GB', region: 'us-east-1' },
    { id: 'SRV-8907', name: 'NEXORA Automation Worker #4', type: 'Cron Execution', status: 'FAILED', latency: '990ms', memory: '0.5 GB', region: 'eu-central-1' }
  ];

  const filteredGrid = mockDataGrid.filter((item) =>
    item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.type.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const handleRunAiCopilot = () => {
    setIsAiGenerating(true);
    setAiResponse(null);
    setTimeout(() => {
      setIsAiGenerating(false);
      setAiResponse(
        `### NEXORA AI Copilot Optimization Report\n\n1. **Zero-Copy Serialization**: Replace standard JSON payload parsers with protobuf binary buffers in \`nexora/core/rpc.py\`.\n2. **Shared Memory Bus**: Enable Linux \`shm\` ring-buffers for inter-process worker queues.\n3. **Predicted Performance Gain**: Latency reduces from **1.2ms → 0.38ms** (-68% overhead).`
      );
      onTriggerToast('AI Copilot Result', 'Generated optimization strategy in 320ms', 'ai');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Component Sub-Navigation */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 shadow-md font-mono">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-bold text-white uppercase">Component Library Gallery</h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'controls' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            BUTTONS & CONTROLS
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'forms' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            INPUTS & FORMS
          </button>
          <button
            onClick={() => setActiveTab('datagrid')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'datagrid' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            DATA GRIDS & TABLES
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'charts' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            SVG METRIC CHARTS
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'timeline' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            TIMELINE & AUDIT LOG
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'ai' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            AI COPILOT WIDGETS
          </button>
          <button
            onClick={() => setActiveTab('states')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'states' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            STATES & DIALOGS
          </button>
        </div>
      </div>

      {/* 1. BUTTONS & CONTROLS */}
      {activeTab === 'controls' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6">
          <div className="border-b border-[#334155] pb-4 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase">Buttons & Action Controls</h3>
              <p className="text-xs text-slate-400 mt-1">
                Linear & Vercel inspired action triggers with micro-padding math (Padding-X = 2x Padding-Y).
              </p>
            </div>
            <button
              onClick={() =>
                onOpenCodeModal(
                  'Button Tokens',
                  `<button className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded text-xs shadow-md transition-colors cursor-pointer flex items-center">
  Primary Action
</button>`
                )
              }
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 text-xs font-mono rounded cursor-pointer"
            >
              Copy JSX Code
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Action Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">01. Primary Brand Button</span>
              <div>
                <button
                  onClick={() => onTriggerToast('Button Click', 'Primary Action Executed', 'success')}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded text-xs shadow-md transition-all cursor-pointer flex items-center"
                >
                  <Play className="w-3.5 h-3.5 mr-2 fill-slate-950" />
                  EXECUTE PIPELINE
                </button>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">02. Secondary Slate Button</span>
              <div>
                <button
                  onClick={() => onTriggerToast('Button Click', 'Secondary Action Executed', 'info')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded text-xs border border-slate-700 transition-all cursor-pointer flex items-center"
                >
                  <RotateCw className="w-3.5 h-3.5 mr-2 text-sky-400" />
                  REFRESH DATA
                </button>
              </div>
            </div>

            {/* Destructive Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">03. Destructive Action</span>
              <div>
                <button
                  onClick={() => onTriggerToast('Action Alert', 'Node Terminated', 'error')}
                  className="px-4 py-2 bg-red-600/90 hover:bg-red-500 text-white font-bold rounded text-xs shadow-md transition-all cursor-pointer flex items-center"
                >
                  <X className="w-3.5 h-3.5 mr-2" />
                  TERMINATE NODE
                </button>
              </div>
            </div>

            {/* Icon-Only Buttons */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">04. Icon Control Bar</span>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer">
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading State Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">05. Loading State</span>
              <div>
                <button disabled className="px-4 py-2 bg-sky-500/50 text-slate-950 font-bold rounded text-xs flex items-center opacity-75 cursor-not-allowed">
                  <RotateCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                  DEPLOYING MESH...
                </button>
              </div>
            </div>

            {/* Badge Indicator Buttons */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">06. Badge Action Pill</span>
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Sparkles className="w-3 h-3 mr-1.5 text-purple-400" />
                  AI COPILOT ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INPUTS & FORMS */}
      {activeTab === 'forms' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6">
          <div className="border-b border-[#334155] pb-4">
            <h3 className="text-base font-bold text-white font-mono uppercase">Form Elements & Inputs</h3>
            <p className="text-xs text-slate-400 mt-1">
              High-contrast input fields, search boxes with clear triggers, code textareas, range sliders, and toggles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
            {/* Text Input with Icon */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">Server Host Node Name</label>
              <div className="relative flex items-center">
                <Terminal className="w-4 h-4 text-sky-400 absolute left-3" />
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase">Strict Zero-Trust Enforcer</div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Enforce mTLS on every inter-node packet</p>
              </div>
              <button
                onClick={() => setToggleState(!toggleState)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  toggleState ? 'bg-sky-500' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <div
                  className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    toggleState ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Range Slider */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300 uppercase">RPC Rate Limit Threshold</span>
                <span className="text-sky-400 font-bold">{sliderVal} req/ms</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Radio Selection Group */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase">Deployment Environment</span>
              <div className="flex items-center space-x-4 pt-1">
                {['dev', 'staging', 'prod'].map((env) => (
                  <label key={env} className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="env"
                      checked={selectedRadio === env}
                      onChange={() => setSelectedRadio(env)}
                      className="accent-sky-400"
                    />
                    <span className="uppercase">{env}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DATA GRIDS & TABLES */}
      {activeTab === 'datagrid' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-4 font-mono">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155] pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase">High-Density Enterprise Data Grid</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Real-time sorting, status filtering, and density control for NEXORA microservices.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter nodes..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>
              <button
                onClick={() => setTableSort(tableSort === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 hover:text-white cursor-pointer"
              >
                Sort: {tableSort.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded border border-slate-800 bg-[#020617]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#1e293b] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Node ID</th>
                  <th className="p-3">Service Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Memory</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredGrid.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-sky-400">{row.id}</td>
                    <td className="p-3 text-white font-semibold">{row.name}</td>
                    <td className="p-3 text-slate-400">{row.type}</td>
                    <td className="p-3">
                      {row.status === 'HEALTHY' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          HEALTHY
                        </span>
                      )}
                      {row.status === 'WARNING' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                          WARNING
                        </span>
                      )}
                      {row.status === 'FAILED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                          CRITICAL
                        </span>
                      )}
                    </td>
                    <td className="p-3">{row.latency}</td>
                    <td className="p-3">{row.memory}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onTriggerToast('Node Inspect', `Inspecting telemetry for ${row.id}`, 'info')}
                        className="text-sky-400 hover:underline cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SVG METRIC CHARTS */}
      {activeTab === 'charts' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6">
          <div className="border-b border-[#334155] pb-4">
            <h3 className="text-base font-bold text-white font-mono uppercase">Crisp SVG Data Visualizations</h3>
            <p className="text-xs text-slate-400 mt-1">
              Zero-dependency, high-performance SVG line charts, area fills, bar indicators, and metric rings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
            {/* Area Line Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">NEXORA Mesh Network Throughput (GB/s)</span>
                <span className="text-sky-400 font-bold">+18.4%</span>
              </div>
              <div className="h-36 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#334155" strokeDasharray="3 3" />

                  {/* Area Fill */}
                  <polygon
                    points="0,80 30,60 60,70 90,40 120,45 150,25 180,35 210,15 240,20 270,10 300,15 300,100 0,100"
                    fill="url(#chartGrad)"
                  />
                  {/* Line Stroke */}
                  <polyline
                    points="0,80 30,60 60,70 90,40 120,45 150,25 180,35 210,15 240,20 270,10 300,15"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">CLI Execution Latency (ms / sprint)</span>
                <span className="text-emerald-400 font-bold">142ms Avg</span>
              </div>
              <div className="h-36 w-full flex items-end justify-between gap-2 pt-4">
                {[80, 65, 90, 45, 30, 25, 20, 15].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-sky-500 rounded-t transition-all hover:bg-sky-400 cursor-pointer"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[9px] text-slate-500">S{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TIMELINE & AUDIT LOG */}
      {activeTab === 'timeline' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6 font-mono">
          <div className="border-b border-[#334155] pb-4 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white uppercase">Enterprise Activity & Audit Log</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Immutable event stream tracking deployments, configuration updates, and AI copilot actions.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              AUDIT TRAIL VERIFIED
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                time: '18:42:01 PST',
                user: 'Lead Architect (yacoubd514@gmail.com)',
                action: 'NEXORA CORE Mesh Deployment',
                desc: 'Applied new zero-trust firewall rules across 256 cluster nodes',
                status: 'SUCCESS'
              },
              {
                time: '18:15:33 PST',
                user: 'NEXORA AI Copilot Agent',
                action: 'Automatic Schema Migration',
                desc: 'Executed Drizzle migration for PostgreSQL database schema update',
                status: 'SUCCESS'
              },
              {
                time: '17:50:12 PST',
                user: 'DevOps System Monitor',
                action: 'Rate Limit Warning',
                desc: 'NEXORA Mining Pipeline exceeded 1.2M records/sec threshold',
                status: 'WARN'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#020617] border border-slate-800 rounded-lg p-4 flex items-start space-x-4">
                <div className="p-2 bg-slate-900 rounded border border-slate-700">
                  <Clock className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{item.action}</span>
                    <span className="text-[10px] text-slate-500">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">{item.desc}</p>
                  <div className="text-[10px] text-slate-500 mt-2">By {item.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. AI COPILOT WIDGETS */}
      {activeTab === 'ai' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6">
          <div className="border-b border-[#334155] pb-4">
            <h3 className="text-base font-bold text-white font-mono uppercase flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              NEXORA AI Copilot Interactive Widget
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous reasoning assistant powered by Gemini for real-time architecture suggestions and code refactoring.
            </p>
          </div>

          <div className="bg-[#020617] border border-purple-500/30 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-purple-300 font-bold flex items-center">
                <Bot className="w-4 h-4 mr-2 text-purple-400" />
                NEXORA Copilot Reasoning Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300">Prompt / Query</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded p-3 text-xs font-mono text-purple-200 outline-none focus:border-purple-400 h-20 resize-none"
              />
            </div>

            <button
              onClick={handleRunAiCopilot}
              disabled={isAiGenerating}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-xs font-mono transition-colors flex items-center cursor-pointer shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              {isAiGenerating ? 'REASONING & COMPUTING...' : 'RUN COPILOT ANALYSIS'}
            </button>

            {aiResponse && (
              <div className="p-4 bg-slate-900/90 border border-purple-500/40 rounded-lg text-xs font-mono text-slate-200 space-y-2">
                <div className="text-[10px] text-purple-400 font-bold uppercase border-b border-slate-800 pb-2">
                  Generated Architectural Plan
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{aiResponse}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. STATES & DIALOGS */}
      {activeTab === 'states' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shimmer Skeleton Loading */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-4">
              <h4 className="text-sm font-bold text-white font-mono uppercase">01. Shimmer Loading State</h4>
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-20 bg-slate-900 rounded border border-slate-800"></div>
              </div>
            </div>

            {/* Empty State */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md text-center space-y-3">
              <h4 className="text-sm font-bold text-white font-mono uppercase">02. Empty State Pattern</h4>
              <div className="py-6 space-y-2">
                <Database className="w-8 h-8 mx-auto text-slate-500" />
                <div className="text-xs font-bold text-slate-300 font-mono">No Data Mining Extractors Mapped</div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Get started by mapping a new telemetry stream or importing a YAML schema.
                </p>
                <button
                  onClick={() => onTriggerToast('Create Extractor', 'Opened Extractor Wizard', 'info')}
                  className="mt-2 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono rounded cursor-pointer"
                >
                  Create Extractor
                </button>
              </div>
            </div>
          </div>

          {/* Trigger Modal Dialog Demo */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md flex justify-between items-center font-mono">
            <div>
              <h4 className="text-sm font-bold text-white uppercase">Interactive Dialog Modal Component</h4>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Test accessible overlay dialogs and confirmation modals.</p>
            </div>
            <button
              onClick={() => setDemoModalOpen(true)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded cursor-pointer shadow-md"
            >
              Open Dialog Modal
            </button>
          </div>

          {/* Modal Overlay */}
          {demoModalOpen && (
            <div
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
              onClick={() => setDemoModalOpen(false)}
            >
              <div
                className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center font-mono border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase">Confirm Node Reset</h3>
                  <button onClick={() => setDemoModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Are you sure you want to restart cluster node <code className="text-sky-400 font-mono">SRV-8902</code>? Traffic will be re-routed instantly without drop.
                </p>
                <div className="flex justify-end space-x-3 pt-2 font-mono text-xs">
                  <button
                    onClick={() => setDemoModalOpen(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setDemoModalOpen(false);
                      onTriggerToast('Node Reset', 'SRV-8902 reset initiated successfully', 'success');
                    }}
                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
