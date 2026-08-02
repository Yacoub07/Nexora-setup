import React, { useState } from 'react';
import { NexoraProductId } from '../../types/designSystem';
import { NEXORA_PRODUCTS } from '../../data/nexoraProducts';

// Existing Forge views
import { TerminalView } from '../TerminalView';
import { DoctorView } from '../DoctorView';
import { WorkspaceView } from '../WorkspaceView';
import { TestRunnerView } from '../TestRunnerView';
import { CodebaseBrowserView } from '../CodebaseBrowserView';
import { DocsView } from '../DocsView';

import {
  Terminal,
  Stethoscope,
  FolderGit2,
  TestTube2,
  Code2,
  BookOpen,
  Activity,
  Server,
  Database,
  Radio,
  Bot,
  Workflow,
  BarChart3,
  ShoppingBag,
  Cpu,
  Layers,
  Search,
  Zap,
  Shield,
  Download,
  Plus,
  Play
} from 'lucide-react';

interface ProductWorkspaceProps {
  productId: NexoraProductId;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const ProductWorkspace: React.FC<ProductWorkspaceProps> = ({ productId, onTriggerToast }) => {
  const product = NEXORA_PRODUCTS.find((p) => p.id === productId) || NEXORA_PRODUCTS[0];
  const [activeTab, setActiveTab] = useState(product.navItems[0]?.id || 'overview');

  return (
    <div className="space-y-6">
      {/* Product Hero Banner styled with NEXORA Design Tokens */}
      <div
        className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-xl relative overflow-hidden"
        style={{ borderTop: `3px solid ${product.accentColor}` }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 font-mono">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                {product.category}
              </span>
              <span
                className="text-[10px] uppercase font-bold px-2 py-0.5 rounded font-mono"
                style={{ color: product.accentColor, backgroundColor: `${product.accentColor}15` }}
              >
                LIVE PRODUCT CANVAS
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1 font-mono uppercase tracking-tight flex items-center">
              {product.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onTriggerToast('Product Action', `Launched primary task for ${product.name}`, 'success')}
              className="px-4 py-2 text-slate-950 font-bold rounded text-xs font-mono transition-colors shadow-md flex items-center cursor-pointer"
              style={{ backgroundColor: product.accentColor }}
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-slate-950" />
              LAUNCH PRODUCT ENGINE
            </button>
          </div>
        </div>

        {/* Product Specific Live Metric Pills */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          {product.metrics.map((met, idx) => (
            <div key={idx} className="bg-[#020617] p-3 rounded border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">{met.label}</div>
              <div className="text-base font-bold text-white mt-0.5">{met.value}</div>
              {met.change && (
                <div className={`text-[10px] mt-0.5 ${met.positive ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {met.change}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-2 flex space-x-1 font-mono overflow-x-auto">
        {product.navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === item.id
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* WORKSPACE CONTENT ROUTER */}

      {/* 1. NEXORA FORGE VIEWS */}
      {productId === 'forge' && (
        <>
          {activeTab === 'terminal' && <TerminalView />}
          {activeTab === 'doctor' && <DoctorView />}
          {activeTab === 'workspace' && <WorkspaceView />}
          {activeTab === 'tests' && <TestRunnerView />}
          {activeTab === 'codebase' && <CodebaseBrowserView />}
          {activeTab === 'docs' && <DocsView />}
        </>
      )}

      {/* 2. NEXORA STUDIO */}
      {productId === 'studio' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6">
          <div className="flex justify-between items-center font-mono border-b border-[#334155] pb-4">
            <h3 className="text-base font-bold text-white uppercase">Visual Canvas & Wireframe Inspector</h3>
            <span className="text-xs text-purple-400 bg-purple-950 px-2 py-1 rounded border border-purple-800">
              Figma Token Sync: Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            <div className="bg-[#020617] border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-xs font-bold text-purple-400 uppercase">01. Screen Layout Tree</span>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2 bg-slate-900 rounded border border-slate-800 font-bold">AppShell (Root)</div>
                <div className="pl-4 space-y-1">
                  <div className="p-1.5 bg-slate-900/60 rounded text-sky-300">├─ GlobalHeader</div>
                  <div className="p-1.5 bg-slate-900/60 rounded text-sky-300">├─ ProductWorkspace</div>
                  <div className="p-1.5 bg-slate-900/60 rounded text-sky-300">└─ GlobalFooter</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-[#020617] border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
              <Layers className="w-12 h-12 text-purple-400" />
              <h4 className="text-sm font-bold text-white uppercase">Interactive Visual Wireframe Stage</h4>
              <p className="text-xs text-slate-400 max-w-md font-sans">
                Drag and drop reusable NEXORA Design System primitives directly onto this visual canvas.
              </p>
              <button
                onClick={() => onTriggerToast('Studio Action', 'Added new UI Card container to canvas', 'info')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-xs font-mono cursor-pointer"
              >
                + ADD DESIGN SYSTEM COMPONENT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NEXORA CORE */}
      {productId === 'core' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6 font-mono">
          <div className="flex justify-between items-center border-b border-[#334155] pb-4">
            <h3 className="text-base font-bold text-white uppercase">Distributed Cluster Mesh Matrix</h3>
            <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2 py-1 rounded border border-rose-800">
              256 NODES ONLINE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#020617] border border-slate-800 p-3 rounded text-center space-y-1 hover:border-rose-500 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto" />
                <div className="text-[10px] text-slate-400 font-bold">NODE-{i + 101}</div>
                <div className="text-[9px] text-slate-500">1.2ms</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. KNOWLEDGE PORTAL */}
      {productId === 'knowledge' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-[#334155] pb-4 font-mono">
            <h3 className="text-base font-bold text-white uppercase">Semantic Vector Search Knowledge Base</h3>
            <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
              1.2 TB Indexed
            </span>
          </div>

          <div className="relative font-mono">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search 45,210 architectural docs, ADRs, and API schemas..."
              className="w-full bg-[#020617] border border-slate-700 rounded pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-3 font-sans">
            {[
              { title: 'ADR-089: Zero-Trust Inter-Process Communication', tags: ['Architecture', 'Security', 'CORE'], date: 'Jul 28, 2026' },
              { title: 'NEXORA Enterprise Design System Specification v2.4', tags: ['Design Tokens', 'UI', 'Components'], date: 'Jul 31, 2026' },
              { title: 'High-Throughput Data Mining Extractors for Stream Processing', tags: ['Mining', 'ETL', 'SIGS'], date: 'Jul 25, 2026' }
            ].map((doc, idx) => (
              <div key={idx} className="p-4 bg-[#020617] border border-slate-800 rounded-lg hover:border-emerald-500/50 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white font-mono">{doc.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{doc.date}</span>
                </div>
                <div className="flex space-x-2 mt-2 font-mono">
                  {doc.tags.map((t, tIdx) => (
                    <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-10. OTHER PRODUCTS DEFAULT ENTERPRISE CANVAS */}
      {!['forge', 'studio', 'core', 'knowledge'].includes(productId) && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8 shadow-md text-center space-y-4 font-mono">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase">{product.name} Live Environment</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto font-sans mt-1">
              Fully integrated with the unified NEXORA Design System tokens and components.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onTriggerToast('Engine Action', `${product.name} background worker started`, 'success')}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded cursor-pointer shadow-md"
            >
              RUN {product.name.toUpperCase()} WORKER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
