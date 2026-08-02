import { NexoraProduct } from '../types/designSystem';

export const NEXORA_PRODUCTS: NexoraProduct[] = [
  {
    id: 'forge',
    name: 'NEXORA Forge',
    tagline: 'CLI, Clean Architecture Builder & Developer Workbench',
    category: 'Developer Tools',
    accentColor: '#38bdf8', // sky-400
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/30',
    iconName: 'Terminal',
    description: 'Command-line execution, workspace validator, and clean-architecture project scaffolding engine.',
    metrics: [
      { label: 'Active Projects', value: '1,420', change: '+12.4%', positive: true },
      { label: 'Build Success', value: '99.82%', change: '+0.1%', positive: true },
      { label: 'Avg CLI Exec Time', value: '142ms', change: '-18ms', positive: true },
      { label: 'Active Doctor Checks', value: '38/38 Pass', positive: true }
    ],
    navItems: [
      { id: 'terminal', label: 'CLI Terminal', icon: 'Terminal' },
      { id: 'doctor', label: 'Doctor Diagnostics', icon: 'Stethoscope' },
      { id: 'workspace', label: 'Workspace Architect', icon: 'FolderGit2' },
      { id: 'tests', label: 'Test Suite Runner', icon: 'TestTube2' },
      { id: 'codebase', label: 'Code Explorer', icon: 'Code2' }
    ]
  },
  {
    id: 'studio',
    name: 'NEXORA Studio',
    tagline: 'Visual Application Builder & Design System Canvas',
    category: 'Developer Tools',
    accentColor: '#a855f7', // purple-500
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
    iconName: 'LayoutGrid',
    description: 'WYSIWYG layout builder, visual token editor, component wireframing, and interactive UI previewer.',
    metrics: [
      { label: 'Published Screens', value: '8,920', change: '+24%', positive: true },
      { label: 'UI Component Count', value: '128 Tokens', positive: true },
      { label: 'HMR Latency', value: '12ms', change: 'Optimal', positive: true },
      { label: 'Figma Sync Status', value: 'Connected', positive: true }
    ],
    navItems: [
      { id: 'canvas', label: 'Visual Canvas', icon: 'Layout' },
      { id: 'components', label: 'Component Library', icon: 'Box' },
      { id: 'theme', label: 'Theme Generator', icon: 'Palette' },
      { id: 'export', label: 'Code Export', icon: 'Download' }
    ]
  },
  {
    id: 'core',
    name: 'NEXORA CORE',
    tagline: 'Distributed Cloud Operating Engine & Mesh Grid',
    category: 'Operations & Ecosystem',
    accentColor: '#f43f5e', // rose-500
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/30',
    iconName: 'Cpu',
    description: 'High-availability container mesh, RPC routing layer, memory cache orchestrator, and zero-trust auth.',
    metrics: [
      { label: 'Uptime (30d)', value: '99.999%', positive: true },
      { label: 'Cluster Nodes', value: '256 Active', change: '+32', positive: true },
      { label: 'Network Throughput', value: '42.8 GB/s', change: '+8.2%', positive: true },
      { label: 'RPC Latency', value: '1.2ms', positive: true }
    ],
    navItems: [
      { id: 'mesh', label: 'Cluster Mesh', icon: 'Network' },
      { id: 'nodes', label: 'Node Telemetry', icon: 'Server' },
      { id: 'gateway', label: 'API Gateway', icon: 'Key' },
      { id: 'security', label: 'Zero-Trust Auth', icon: 'ShieldCheck' }
    ]
  },
  {
    id: 'knowledge',
    name: 'NEXORA Knowledge Portal',
    tagline: 'Enterprise Semantic Wiki, Vector Search & Docs',
    category: 'Operations & Ecosystem',
    accentColor: '#10b981', // emerald-500
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
    iconName: 'BookOpen',
    description: 'AI-grounded documentation hub, architectural decision records (ADRs), and internal developer portal.',
    metrics: [
      { label: 'Indexed Documents', value: '45,210', change: '+1,200', positive: true },
      { label: 'Vector Index Size', value: '1.2 TB', positive: true },
      { label: 'Search Query Latency', value: '48ms', positive: true },
      { label: 'Search Satisfaction', value: '98.4%', positive: true }
    ],
    navItems: [
      { id: 'search', label: 'Semantic Search', icon: 'Search' },
      { id: 'articles', label: 'Knowledge Base', icon: 'FileText' },
      { id: 'adrs', label: 'Arch Decisions (ADR)', icon: 'GitPullRequest' },
      { id: 'graph', label: 'Knowledge Graph', icon: 'GitFork' }
    ]
  },
  {
    id: 'mining',
    name: 'NEXORA Mining Platform',
    tagline: 'High-Throughput Data Mining & ETL Pipeline Engine',
    category: 'Data & Mining',
    accentColor: '#f59e0b', // amber-500
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
    iconName: 'Pickaxe',
    description: 'Distributed log mining, real-time structured data extraction, pattern mining, and batch ETL jobs.',
    metrics: [
      { label: 'Mined Records/sec', value: '1.25M', change: '+18%', positive: true },
      { label: 'Active Extractors', value: '84 Streams', positive: true },
      { label: 'Data Compression', value: '8.4x Ratio', positive: true },
      { label: 'Pipeline Failure Rate', value: '0.001%', positive: true }
    ],
    navItems: [
      { id: 'extractors', label: 'Data Extractors', icon: 'Database' },
      { id: 'jobs', label: 'Mining Jobs', icon: 'Activity' },
      { id: 'schemas', label: 'Pattern Schemas', icon: 'Binary' },
      { id: 'warehouses', label: 'Data Lake Sink', icon: 'HardDrive' }
    ]
  },
  {
    id: 'sigs',
    name: 'NEXORA SIGS',
    tagline: 'Signal Intelligence & Event Streaming Mesh',
    category: 'Data & Mining',
    accentColor: '#06b6d4', // cyan-500
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    iconName: 'Radio',
    description: 'Ultra-low latency event streaming, anomaly signal detection, payload filtering, and telemetry triggers.',
    metrics: [
      { label: 'Streaming Events/sec', value: '4.8M', change: '+31%', positive: true },
      { label: 'Sub-millisecond Streams', value: '99.4%', positive: true },
      { label: 'Active Signals', value: '1,280 Monitors', positive: true },
      { label: 'Anomalies Flagged', value: '3 Active', positive: false }
    ],
    navItems: [
      { id: 'signals', label: 'Signal Stream', icon: 'Radio' },
      { id: 'monitors', label: 'Anomaly Monitors', icon: 'AlertTriangle' },
      { id: 'webhooks', label: 'Event Webhooks', icon: 'Webhook' },
      { id: 'topography', label: 'Stream Map', icon: 'Compass' }
    ]
  },
  {
    id: 'ai',
    name: 'NEXORA AI',
    tagline: 'Omni Model Fine-Tuning & Autonomous Agent Suite',
    category: 'Intelligence & AI',
    accentColor: '#ec4899', // pink-500
    accentBg: 'bg-pink-500/10',
    accentBorder: 'border-pink-500/30',
    iconName: 'Sparkles',
    description: 'Multi-agent orchestration, reasoning chains, fine-tuned Gemini model deployments, and AI Copilot.',
    metrics: [
      { label: 'Agent Executions/day', value: '380,000', change: '+45%', positive: true },
      { label: 'Avg Token Generation', value: '185 t/s', positive: true },
      { label: 'Active Fine-tunes', value: '14 Models', positive: true },
      { label: 'Safety Guard Score', value: '100% Pass', positive: true }
    ],
    navItems: [
      { id: 'agents', label: 'Autonomous Agents', icon: 'Bot' },
      { id: 'copilot', label: 'AI Copilot Lab', icon: 'Sparkles' },
      { id: 'prompts', label: 'Prompt Registry', icon: 'MessageSquareCode' },
      { id: 'models', label: 'Fine-Tuned Models', icon: 'BrainCircuit' }
    ]
  },
  {
    id: 'automation',
    name: 'NEXORA Automation',
    tagline: 'Enterprise Workflow Orchestration & Event Triggers',
    category: 'Intelligence & AI',
    accentColor: '#6366f1', // indigo-500
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/30',
    iconName: 'Workflow',
    description: 'Visual flow graph executor, cron triggers, step functions, and automated incident remediation.',
    metrics: [
      { label: 'Workflows Executed', value: '2.4M/mo', change: '+15%', positive: true },
      { label: 'Avg Flow Duration', value: '410ms', positive: true },
      { label: 'Failed Workflow Retry', value: '99.9%', positive: true },
      { label: 'Active Cron Schedules', value: '420 Jobs', positive: true }
    ],
    navItems: [
      { id: 'builder', label: 'Workflow Builder', icon: 'Workflow' },
      { id: 'triggers', label: 'Event Triggers', icon: 'Zap' },
      { id: 'logs', label: 'Execution Logs', icon: 'ListFilter' },
      { id: 'connectors', label: 'SaaS Connectors', icon: 'Link' }
    ]
  },
  {
    id: 'analytics',
    name: 'NEXORA Analytics',
    tagline: 'Real-Time Telemetry & Enterprise BI Dashboards',
    category: 'Operations & Ecosystem',
    accentColor: '#14b8a6', // teal-500
    accentBg: 'bg-teal-500/10',
    accentBorder: 'border-teal-500/30',
    iconName: 'LineChart',
    description: 'Instant aggregation, custom dashboard builder, retention analysis, and executive telemetry reporting.',
    metrics: [
      { label: 'Queries Executed', value: '18.4M', change: '+8.2%', positive: true },
      { label: 'Dashboard Load', value: '34ms', positive: true },
      { label: 'Active Alerts', value: '12 Active', positive: false },
      { label: 'Data Retention', value: '365 Days', positive: true }
    ],
    navItems: [
      { id: 'dashboards', label: 'BI Dashboards', icon: 'BarChart3' },
      { id: 'queries', label: 'SQL Query Studio', icon: 'Code' },
      { id: 'alerts', label: 'Alert Thresholds', icon: 'Bell' },
      { id: 'export', label: 'Report Exporter', icon: 'FileSpreadsheet' }
    ]
  },
  {
    id: 'marketplace',
    name: 'NEXORA Marketplace',
    tagline: 'Enterprise Extension Hub & Integration Registry',
    category: 'Operations & Ecosystem',
    accentColor: '#8b5cf6', // violet-500
    accentBg: 'bg-violet-500/10',
    accentBorder: 'border-violet-500/30',
    iconName: 'ShoppingBag',
    description: 'Verified enterprise plugins, custom integrations, community tools, and API connector packages.',
    metrics: [
      { label: 'Verified Plugins', value: '340 Extensions', change: '+28', positive: true },
      { label: 'Total Downloads', value: '1.8M', change: '+320k', positive: true },
      { label: 'Publisher Rating', value: '4.92 / 5.0', positive: true },
      { label: 'Security Audited', value: '100% Clean', positive: true }
    ],
    navItems: [
      { id: 'store', label: 'Extension Store', icon: 'ShoppingBag' },
      { id: 'installed', label: 'Installed Plugins', icon: 'CheckSquare' },
      { id: 'publish', label: 'Publisher Console', icon: 'Upload' },
      { id: 'keys', label: 'License Keys', icon: 'Shield' }
    ]
  }
];
