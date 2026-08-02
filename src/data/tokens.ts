import { ColorToken } from '../types/designSystem';

export const COLOR_TOKENS: ColorToken[] = [
  // Primary Neutrals (Slate/Zinc hybrid)
  { name: 'Canvas Dark', hex: '#0f172a', usage: 'Primary background across NEXORA applications', category: 'Neutral', bgClass: 'bg-slate-900', textClass: 'text-slate-900' },
  { name: 'Surface Panel', hex: '#1e293b', usage: 'Card surfaces, sidebar panels, modal bodies', category: 'Neutral', bgClass: 'bg-slate-800', textClass: 'text-slate-800' },
  { name: 'Surface Deep', hex: '#020617', usage: 'CLI terminal, code editor canvases, dark inset boxes', category: 'Neutral', bgClass: 'bg-slate-950', textClass: 'text-slate-950' },
  { name: 'Border UI', hex: '#334155', usage: 'Subtle 1px grid borders, divider lines, panel frames', category: 'Neutral', bgClass: 'bg-slate-700', textClass: 'text-slate-700' },
  { name: 'Muted Text', hex: '#94a3b8', usage: 'Secondary text, metadata tags, subtitles', category: 'Neutral', bgClass: 'bg-slate-400', textClass: 'text-slate-400' },
  { name: 'High-Contrast Text', hex: '#f8fafc', usage: 'Headings, primary button labels, active state highlights', category: 'Neutral', bgClass: 'bg-slate-50', textClass: 'text-slate-50' },

  // Product Accent Colors
  { name: 'Forge Sky Accent', hex: '#38bdf8', usage: 'NEXORA Forge primary interactive states & active CLI focus', category: 'Product Accent', bgClass: 'bg-sky-400', textClass: 'text-sky-400' },
  { name: 'Studio Purple Accent', hex: '#a855f7', usage: 'NEXORA Studio visual canvas selections & design elements', category: 'Product Accent', bgClass: 'bg-purple-500', textClass: 'text-purple-500' },
  { name: 'Core Rose Accent', hex: '#f43f5e', usage: 'NEXORA CORE cluster node indicators & mesh nodes', category: 'Product Accent', bgClass: 'bg-rose-500', textClass: 'text-rose-500' },
  { name: 'Knowledge Emerald Accent', hex: '#10b981', usage: 'NEXORA Knowledge search highlights & doc status', category: 'Product Accent', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
  { name: 'Mining Amber Accent', hex: '#f59e0b', usage: 'NEXORA Mining pipeline status & rate metrics', category: 'Product Accent', bgClass: 'bg-amber-500', textClass: 'text-amber-500' },

  // Semantic Feedback Tokens
  { name: 'Success Green', hex: '#22c55e', usage: 'Passing tests, healthy status, completed builds', category: 'Semantic', bgClass: 'bg-green-500', textClass: 'text-green-500' },
  { name: 'Warning Amber', hex: '#eab308', usage: 'Doctor warnings, rate-limit threshold alerts', category: 'Semantic', bgClass: 'bg-yellow-500', textClass: 'text-yellow-500' },
  { name: 'Error Crimson', hex: '#ef4444', usage: 'Validation errors, test failures, critical alerts', category: 'Semantic', bgClass: 'bg-red-500', textClass: 'text-red-500' },
  { name: 'Info Cyan', hex: '#06b6d4', usage: 'Informational toasts, system announcements', category: 'Semantic', bgClass: 'bg-cyan-500', textClass: 'text-cyan-500' }
];

export const TYPOGRAPHY_SCALE = [
  { name: 'Display XL', size: '36px / 2.25rem', weight: 'Bold (700)', font: 'Inter Display / Sans', sample: 'NEXORA Ecosystem' },
  { name: 'Display LG', size: '28px / 1.75rem', weight: 'Bold (700)', font: 'Inter Display / Sans', sample: 'Enterprise Design System' },
  { name: 'Heading 1', size: '22px / 1.375rem', weight: 'SemiBold (600)', font: 'Inter Sans', sample: 'System Diagnostics & Health' },
  { name: 'Heading 2', size: '18px / 1.125rem', weight: 'SemiBold (600)', font: 'Inter Sans', sample: 'Workspace Architecture Inspector' },
  { name: 'Body Regular', size: '14px / 0.875rem', weight: 'Regular (400)', font: 'Inter Sans', sample: 'Clean architecture separation of concerns across distributed services.' },
  { name: 'Body Compact', size: '13px / 0.8125rem', weight: 'Medium (500)', font: 'Inter Sans', sample: 'High-density enterprise data grid row item representation.' },
  { name: 'Code / Mono LG', size: '14px / 0.875rem', weight: 'Medium (500)', font: 'JetBrains Mono', sample: '$ nexora doctor --strict --json' },
  { name: 'Code / Mono Regular', size: '12px / 0.75rem', weight: 'Regular (400)', font: 'JetBrains Mono', sample: 'import { DoctorReport } from "@nexora/core";' },
  { name: 'Micro Caption', size: '10px / 0.625rem', weight: 'Bold (700)', font: 'Inter / Mono', sample: 'SPRINT 1 :: PRODUCTION READY' }
];

export const SPACING_SCALE = [
  { token: 'space-1', px: '4px', usage: 'Micro gaps, inner badge paddings' },
  { token: 'space-2', px: '8px', usage: 'Button horizontal gaps, icon text separation' },
  { token: 'space-3', px: '12px', usage: 'Form field inner padding, compact list gaps' },
  { token: 'space-4', px: '16px', usage: 'Standard card padding, panel headers' },
  { token: 'space-6', px: '24px', usage: 'Section spacing, grid row gaps' },
  { token: 'space-8', px: '32px', usage: 'Major layout container padding' }
];

export const ELEVATION_TOKENS = [
  { name: 'Flat Inset', class: 'shadow-inner bg-slate-950', description: 'Terminal output boxes, code blocks, text inputs' },
  { name: 'Low Elevation', class: 'shadow-sm border border-[#334155]', description: 'Data table rows, list items, subtle badges' },
  { name: 'Medium Elevation', class: 'shadow-md border border-[#334155] bg-[#1e293b]', description: 'Main card panels, widget containers, sidebar headers' },
  { name: 'High Elevation (Overlays)', class: 'shadow-2xl border border-slate-700 bg-slate-900', description: 'Command Palette, Modals, Toasts, Dropdown menus' }
];
