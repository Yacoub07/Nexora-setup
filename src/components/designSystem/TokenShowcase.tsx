import React, { useState } from 'react';
import { COLOR_TOKENS, TYPOGRAPHY_SCALE, SPACING_SCALE, ELEVATION_TOKENS } from '../../data/tokens';
import { Palette, Type, Grid, Layers, ShieldCheck, Copy, Check, Info } from 'lucide-react';

interface TokenShowcaseProps {
  onOpenCodeModal: (title: string, code: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const TokenShowcase: React.FC<TokenShowcaseProps> = ({ onOpenCodeModal, onTriggerToast }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'colors' | 'typography' | 'spacing' | 'elevation'>('colors');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    onTriggerToast('Token Copied', `Copied ${label} (${text}) to clipboard`, 'success');
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Category Tabs */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 shadow-md font-mono">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">NEXORA Design Tokens Explorer</h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedCategory('colors')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'colors' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            COLOR SYSTEM
          </button>
          <button
            onClick={() => setSelectedCategory('typography')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'typography' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            TYPOGRAPHY SCALE
          </button>
          <button
            onClick={() => setSelectedCategory('spacing')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'spacing' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            SPACING & GRID
          </button>
          <button
            onClick={() => setSelectedCategory('elevation')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'elevation' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            ELEVATION & BORDERS
          </button>
        </div>
      </div>

      {/* 1. COLOR TOKENS VIEW */}
      {selectedCategory === 'colors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLOR_TOKENS.map((token, idx) => (
              <div
                key={idx}
                className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 shadow-md space-y-3 hover:border-sky-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-sky-400 border border-slate-700 font-bold uppercase">
                    {token.category}
                  </span>
                  <button
                    onClick={() => copyToClipboard(token.hex, token.name)}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy HEX"
                  >
                    {copiedHex === token.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Color Swatch Box */}
                <div
                  className="h-20 w-full rounded-md border border-slate-700/80 shadow-inner flex items-end p-2 transition-transform group-hover:scale-[1.01]"
                  style={{ backgroundColor: token.hex }}
                >
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white border border-slate-700">
                    {token.hex}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{token.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans">{token.usage}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-500">
                  <span>Class: <code className="text-sky-300">{token.bgClass}</code></span>
                  <button
                    onClick={() =>
                      onOpenCodeModal(
                        `Color Token: ${token.name}`,
                        `/* CSS Variables & Tailwind Tokens */\n:root {\n  --nexora-${token.name.toLowerCase().replace(/\s+/g, '-')}: ${token.hex};\n}\n\n// Tailwind Utility Usage\n<div className="${token.bgClass} ${token.textClass}">\n  ${token.name}\n</div>`
                      )
                    }
                    className="text-sky-400 hover:underline cursor-pointer"
                  >
                    View Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TYPOGRAPHY SCALE VIEW */}
      {selectedCategory === 'typography' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg shadow-md p-6 space-y-6">
          <div className="border-b border-[#334155] pb-4 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase">Mathematical Typography Scale</h3>
              <p className="text-xs text-slate-400 mt-1">
                Paired Inter / Sans for display headers with JetBrains Mono for dense enterprise data and code.
              </p>
            </div>
            <button
              onClick={() =>
                onOpenCodeModal(
                  'Typography Tokens',
                  `/* Font Families */\nfont-sans: 'Inter', system-ui, sans-serif;\nfont-mono: 'JetBrains Mono', monospace;\n\n/* Step Ratios (Major Third / 1.25) */\ntext-display-xl: 2.25rem; /* 36px */\ntext-heading-1:  1.375rem; /* 22px */\ntext-body:        0.875rem; /* 14px */\ntext-mono-code:   0.75rem;  /* 12px */`
                )
              }
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded text-xs font-mono cursor-pointer"
            >
              Copy Typography Config
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {TYPOGRAPHY_SCALE.map((type, idx) => (
              <div key={idx} className="py-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                  <span className="font-bold text-sky-400">{type.name}</span>
                  <span>Size: {type.size} • Weight: {type.weight} • Font: {type.font}</span>
                </div>
                <div
                  className={`text-slate-100 ${
                    type.font.includes('Mono') ? 'font-mono' : 'font-sans'
                  }`}
                  style={{ fontSize: type.size.split(' / ')[0] }}
                >
                  {type.sample}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SPACING & GRID VIEW */}
      {selectedCategory === 'spacing' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg shadow-md p-6 space-y-6">
          <div className="border-b border-[#334155] pb-4">
            <h3 className="text-base font-bold text-white font-mono uppercase">8pt Spatial Grid Scale</h3>
            <p className="text-xs text-slate-400 mt-1">
              Strict 4px/8px incremental padding and margin rhythm across every card, modal, and data container.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPACING_SCALE.map((space, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400">{space.token}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {space.px}
                  </span>
                </div>
                {/* Visual Spacing Box */}
                <div className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center">
                  <div className="bg-sky-500 rounded" style={{ width: space.px, height: '24px' }}></div>
                  <span className="text-[11px] text-slate-400 ml-3 font-sans">{space.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ELEVATION & BORDERS VIEW */}
      {selectedCategory === 'elevation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ELEVATION_TOKENS.map((elev, idx) => (
            <div key={idx} className={`rounded-xl p-6 space-y-3 ${elev.class}`}>
              <div className="flex items-center justify-between font-mono">
                <h4 className="text-sm font-bold text-white">{elev.name}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                  {elev.class.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{elev.description}</p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                Border Rule: 1px <code className="text-sky-300">#334155</code> (Slate-700) • Radius: 8px to 12px
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
