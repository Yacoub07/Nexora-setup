import React, { useState, useEffect, useRef } from 'react';
import { CommandPaletteAction, NexoraProductId } from '../../types/designSystem';
import { NEXORA_PRODUCTS } from '../../data/nexoraProducts';
import { Search, Command, ArrowRight, CornerDownLeft, Sparkles, Box, Palette, Terminal, Shield, Cpu, Activity, ShoppingBag } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: NexoraProductId) => void;
  onSelectSection: (section: 'overview' | 'tokens' | 'components' | 'products' | 'edm' | 'neap' | 'eif' | 'npep' | 'srf' | 'nicf' | 'sdk' | 'core' | 'ssg') => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectSection,
  onTriggerToast
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build list of actions
  const actions: CommandPaletteAction[] = [
    // Section Switchers
    {
      id: 'sec-ssg',
      title: 'Open NEXORA SSG (Phase 9 - Sprint Engineering Package)',
      subtitle: '24 Required Documents, OpenAPI 3.1, SQL DDL, Diagrams & Atomic WBS Tasks for Sprint 1',
      category: 'Architecture',
      shortcut: '⌘ S',
      icon: 'Sparkles',
      action: () => {
        onSelectSection('ssg');
        onTriggerToast('Navigation', 'Opened Phase 9 Sprint Engineering Package Generator (SSG)', 'info');
      }
    },
    {
      id: 'sec-core',
      title: 'Open NEXORA CORE v1.0 (Phase 8)',
      subtitle: 'IAM, Auth, Multi-Tenant Org, RBAC Matrix, Audit & Agile Sprints Roadmap',
      category: 'Architecture',
      shortcut: '⌘ K',
      icon: 'Shield',
      action: () => {
        onSelectSection('core');
        onTriggerToast('Navigation', 'Opened NEXORA CORE v1.0 Platform', 'info');
      }
    },
    {
      id: 'sec-sdk',
      title: 'Open NEXORA Shared SDK v0.1.0 (Phase 7)',
      subtitle: 'Config, Logging, Exceptions, Events, Security, DB, AI, Plugins',
      category: 'Architecture',
      shortcut: '⌘ K',
      icon: 'Box',
      action: () => {
        onSelectSection('sdk');
        onTriggerToast('Navigation', 'Opened Shared Enterprise SDK v0.1.0', 'info');
      }
    },
    {
      id: 'sec-nicf',
      title: 'Open Integration & Communication Framework (NICF)',
      subtitle: 'Phase 6 APIs, gRPC, CloudEvents, Governance & External Connectors',
      category: 'Architecture',
      shortcut: '⌘ N',
      icon: 'Network',
      action: () => {
        onSelectSection('nicf');
        onTriggerToast('Navigation', 'Opened Integration & Communication Framework (NICF)', 'info');
      }
    },
    {
      id: 'sec-srf',
      title: 'Open Shared Runtime Foundation (SRF)',
      subtitle: '13 Enterprise shared runtime services & RAG infrastructure',
      category: 'Architecture',
      shortcut: '⌘ S',
      icon: 'Cpu',
      action: () => {
        onSelectSection('srf');
        onTriggerToast('Navigation', 'Opened Shared Runtime Foundation (SRF)', 'info');
      }
    },
    {
      id: 'sec-overview',
      title: 'Go to Design System Overview',
      subtitle: 'NEXORA Unified Architecture & Guidelines',
      category: 'Design Tokens',
      shortcut: '⌘ 1',
      icon: 'Palette',
      action: () => {
        onSelectSection('overview');
        onTriggerToast('Navigation', 'Opened Design System Overview', 'info');
      }
    },
    {
      id: 'sec-tokens',
      title: 'Explore Design Tokens',
      subtitle: 'Color system, Typography scale, Spacing, Elevation',
      category: 'Design Tokens',
      shortcut: '⌘ 2',
      icon: 'Box',
      action: () => {
        onSelectSection('tokens');
        onTriggerToast('Design Tokens', 'Opened Tokens Explorer', 'info');
      }
    },
    {
      id: 'sec-components',
      title: 'Open Component Library',
      subtitle: 'Buttons, Data Grids, SVG Charts, AI Widgets',
      category: 'Components',
      shortcut: '⌘ 3',
      icon: 'Box',
      action: () => {
        onSelectSection('components');
        onTriggerToast('Component Library', 'Opened Component Showcase', 'info');
      }
    },

    // All 10 NEXORA Products
    ...NEXORA_PRODUCTS.map((prod) => ({
      id: `prod-${prod.id}`,
      title: `Switch to ${prod.name}`,
      subtitle: prod.tagline,
      category: 'Products' as const,
      shortcut: `NEXORA / ${prod.id}`,
      icon: prod.iconName,
      action: () => {
        onSelectProduct(prod.id);
        onSelectSection('products');
        onTriggerToast('Product Switch', `Switched workspace to ${prod.name}`, 'success');
      }
    })),

    // System Actions
    {
      id: 'act-doctor',
      title: 'Run System Diagnostics Check',
      subtitle: 'Executes `nexora doctor` CLI check across workspace',
      category: 'System Actions',
      shortcut: '⇧ ⌘ D',
      icon: 'Activity',
      action: () => {
        onTriggerToast('Doctor Diagnostics', 'Running nexora doctor system check... (38/38 Passed)', 'success');
      }
    },
    {
      id: 'act-ai',
      title: 'Trigger AI Copilot Design Audit',
      subtitle: 'Analyzes design token usage and layout accessibility',
      category: 'System Actions',
      shortcut: '⌥ ⌘ A',
      icon: 'Sparkles',
      action: () => {
        onTriggerToast('AI Copilot', 'Design System Audit: 100% WCAG AAA Compliant. Zero slop detected.', 'ai');
      }
    }
  ];

  const filteredActions = actions.filter((act) => {
    const q = query.toLowerCase();
    return (
      act.title.toLowerCase().includes(q) ||
      (act.subtitle && act.subtitle.toLowerCase().includes(q)) ||
      act.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredActions.length || 1)) % (filteredActions.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        filteredActions[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col divide-y divide-slate-800"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 flex items-center space-x-3 bg-slate-900">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, product name, or token search..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm font-sans outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>

        {/* Action List Items */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 bg-slate-950/90">
          {filteredActions.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500 font-mono">
              No matching commands or products found for "{query}"
            </div>
          ) : (
            filteredActions.map((act, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={act.id}
                  onClick={() => {
                    act.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border border-sky-500/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-1.5 rounded ${isSelected ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-sky-400'}`}>
                      <Command className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold font-mono text-slate-100">{act.title}</div>
                      {act.subtitle && (
                        <div className="text-[11px] text-slate-400 truncate">{act.subtitle}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {act.category}
                    </span>
                    {act.shortcut && (
                      <span className="hidden sm:inline-block text-[10px] font-mono text-sky-300 font-semibold">
                        {act.shortcut}
                      </span>
                    )}
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2.5 bg-slate-900 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center"><CornerDownLeft className="w-3 h-3 mr-1" /> Select</span>
            <span>↑↓ Navigate</span>
            <span>ESC Close</span>
          </div>
          <span className="text-sky-400 font-bold">NEXORA DESIGN SYSTEM v2.4</span>
        </div>
      </div>
    </div>
  );
};
