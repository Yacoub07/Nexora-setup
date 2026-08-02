export type NexoraProductId =
  | 'forge'
  | 'studio'
  | 'core'
  | 'knowledge'
  | 'mining'
  | 'sigs'
  | 'ai'
  | 'automation'
  | 'analytics'
  | 'marketplace';

export interface NexoraProduct {
  id: NexoraProductId;
  name: string;
  tagline: string;
  category: 'Developer Tools' | 'Data & Mining' | 'Intelligence & AI' | 'Operations & Ecosystem';
  accentColor: string; // e.g. '#38bdf8' or Tailwind class
  accentBg: string;
  accentBorder: string;
  iconName: string; // Lucide icon identifier
  description: string;
  metrics: { label: string; value: string; change?: string; positive?: boolean }[];
  navItems: { id: string; label: string; icon: string; badge?: string }[];
}

export type DesignTokenCategory =
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'elevation'
  | 'borders'
  | 'components';

export interface ColorToken {
  name: string;
  hex: string;
  usage: string;
  category: 'Brand' | 'Neutral' | 'Semantic' | 'Product Accent';
  bgClass: string;
  textClass: string;
}

export interface ComponentItem {
  id: string;
  name: string;
  category: 'Primitives' | 'Data & Visuals' | 'Navigation & Layout' | 'Feedback & Overlays' | 'AI & Smart Widgets' | 'States & Fallbacks';
  description: string;
  tags: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: { name: string; email: string; avatar: string; role: string };
  action: string;
  target: string;
  product: NexoraProductId;
  status: 'SUCCESS' | 'WARN' | 'FAILURE' | 'PENDING';
  ip: string;
}

export interface ActivityTimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  author: string;
  type: 'deploy' | 'alert' | 'commit' | 'ai_gen' | 'audit';
  badgeText?: string;
  badgeType?: 'info' | 'success' | 'warning' | 'error';
}

export interface CommandPaletteAction {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Products' | 'Design Tokens' | 'Components' | 'System Actions' | 'Architecture';
  shortcut?: string;
  icon: string;
  action: () => void;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  duration?: number;
}
