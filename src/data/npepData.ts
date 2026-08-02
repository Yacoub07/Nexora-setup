import {
  ProductDefinition,
  Epic,
  UserStory,
  ReleaseMilestone,
  DevelopmentOrderStep,
  SprintDefinition
} from '../types/npep';

export const NPEP_PRODUCTS: ProductDefinition[] = [
  {
    id: 'forge',
    name: 'NEXORA Forge',
    pillar: 'forge',
    mission: 'Empower developers with an intelligent CLI & code-generation engine that scaffolds enterprise-compliant business modules, DDL migrations, FastAPI endpoints, and React UI.',
    scope: ['CLI Engine', 'Doctor Diagnostics', 'Workspace Management', 'Module Generator', 'CRUD Scaffolder', 'Docs Generator', 'Plugin Architecture'],
    priority: 'CRITICAL',
    estimatedComplexity: 'HIGH',
    businessValue: 'CRITICAL',
    technicalRisk: 'MEDIUM',
    dependencies: ['NEXORA SDK v0.1.0']
  },
  {
    id: 'sdk',
    name: 'NEXORA SDK',
    pillar: 'sdk',
    mission: 'Provide standard foundational libraries for logging, telemetry, configuration, security guards, DB ORM abstractions, and zero-trust authentication across all microservices.',
    scope: ['Structured JSON Logging (OTel)', 'YAML/Env Configuration Manager', 'Security & ABAC Rego Guards', 'OAuth2/JWT Auth Core', 'PostgreSQL & pgvector DB Layer'],
    priority: 'CRITICAL',
    estimatedComplexity: 'MEDIUM',
    businessValue: 'CRITICAL',
    technicalRisk: 'LOW',
    dependencies: []
  },
  {
    id: 'studio',
    name: 'NEXORA Studio',
    pillar: 'studio',
    mission: 'Deliver a unified visual workbench for enterprise architects and product managers to model domains, simulate workflows, design APIs, and trigger Forge commands visually.',
    scope: ['Visual Domain Modeler', 'API Spec Designer', 'Workflow Simulator', 'Design System Token Inspector', 'AI Prompt Studio'],
    priority: 'HIGH',
    estimatedComplexity: 'HIGH',
    businessValue: 'HIGH',
    technicalRisk: 'MEDIUM',
    dependencies: ['NEXORA Forge', 'NEXORA SDK']
  },
  {
    id: 'platform',
    name: 'NEXORA Platform',
    pillar: 'platform',
    mission: 'Host the distributed enterprise micro-service mesh powering CORE IAM, Knowledge Portals, Mining, Automation, SIGS, AI pipelines, and Marketplace.',
    scope: ['CORE Mesh & IAM', 'Knowledge Portal (NKP)', 'Process Mining Engine', 'SIGS Governance', 'AI RAG Orchestrator', 'Automation Hub', 'Analytics Engine', 'Marketplace'],
    priority: 'HIGH',
    estimatedComplexity: 'VERY HIGH',
    businessValue: 'CRITICAL',
    technicalRisk: 'HIGH',
    dependencies: ['NEXORA Forge', 'NEXORA SDK', 'NEXORA Studio']
  }
];

export const NPEP_EPICS: Epic[] = [
  {
    id: 'epic-forge-01',
    productId: 'forge',
    code: 'EPIC-FRG-01',
    title: 'Forge CLI Core & Plugin Foundation',
    description: 'Build the underlying CLI engine using Typer/Rich in Python, with modular plugin architecture and configuration auto-loading.',
    features: [
      {
        id: 'feat-frg-01-1',
        epicId: 'epic-forge-01',
        code: 'FEAT-FRG-101',
        title: 'Typer CLI Command Dispatcher',
        businessValue: 'High developer productivity with interactive subcommands and colored terminal output.',
        priority: 'CRITICAL',
        dependencies: ['SDK Logging'],
        estimatedSprint: 'Sprint 1',
        acceptanceCriteria: [
          'Commands executed via nexora <subcommand> with --help flags.',
          'Sub-second CLI startup latency (< 120ms).',
          'Formatted ANSI tables and progress bars using Rich library.'
        ]
      },
      {
        id: 'feat-frg-01-2',
        epicId: 'epic-forge-01',
        code: 'FEAT-FRG-102',
        title: 'Nexora Doctor Diagnostics Engine',
        businessValue: 'Prevents broken development builds by inspecting local Node, Python, Docker, and PostgreSQL sockets.',
        priority: 'CRITICAL',
        dependencies: ['FEAT-FRG-101'],
        estimatedSprint: 'Sprint 1',
        acceptanceCriteria: [
          'nexora doctor checks Python >= 3.11, Node >= 20, Docker engine, and DB connectivity.',
          'Outputs colorized pass/fail matrix.',
          'Supports --fix flag to repair missing directory paths.'
        ]
      }
    ]
  },
  {
    id: 'epic-forge-02',
    productId: 'forge',
    code: 'EPIC-FRG-02',
    title: 'Enterprise Business Module Generator',
    description: 'Scaffold standardized NEXORA business modules containing DDD domain models, FastAPI routes, Drizzle DDL, and React frontend components.',
    features: [
      {
        id: 'feat-frg-02-1',
        epicId: 'epic-forge-02',
        code: 'FEAT-FRG-201',
        title: 'DDD Domain & Service Scaffolder',
        businessValue: 'Enforces 100% adherence to NEXORA Architecture Freeze v1.0 across all generated code.',
        priority: 'CRITICAL',
        dependencies: ['FEAT-FRG-101'],
        estimatedSprint: 'Sprint 2',
        acceptanceCriteria: [
          'nexora module create --name <name> creates /domain, /services, /api, /ui, /locales folders.',
          'Generates Aggregate Root with encapsulating state transition methods.',
          'Generates mypy --strict compliant FastAPI controllers.'
        ]
      }
    ]
  },
  {
    id: 'epic-sdk-01',
    productId: 'sdk',
    code: 'EPIC-SDK-01',
    title: 'Foundational Telemetry & Security Libraries',
    description: 'Core runtime utilities shared across Python microservices and React clients.',
    features: [
      {
        id: 'feat-sdk-01-1',
        epicId: 'epic-sdk-01',
        code: 'FEAT-SDK-101',
        title: 'Structured OpenTelemetry Logging & Metrics',
        businessValue: 'Standardized JSON logs and Prometheus metrics across all ecosystem components.',
        priority: 'CRITICAL',
        dependencies: [],
        estimatedSprint: 'Sprint 1',
        acceptanceCriteria: [
          'All log outputs follow OTel JSON schema with trace_id and span_id.',
          'Zero plaintext password/token leaks in logs.'
        ]
      },
      {
        id: 'feat-sdk-01-2',
        epicId: 'epic-sdk-01',
        code: 'FEAT-SDK-102',
        title: 'Zero-Trust Auth & OPA ABAC Guard',
        businessValue: 'Decoupled fine-grained authorization policies validated in sub-2ms.',
        priority: 'CRITICAL',
        dependencies: ['FEAT-SDK-101'],
        estimatedSprint: 'Sprint 2',
        acceptanceCriteria: [
          'Middleware verifies JWT bearer tokens.',
          'Evaluates Rego security rules against user roles and tenant scopes.'
        ]
      }
    ]
  },
  {
    id: 'epic-plat-01',
    productId: 'platform',
    code: 'EPIC-PLT-01',
    title: 'CORE IAM & Multi-Tenant Service Mesh',
    description: 'The central identity backbone, tenant isolation manager, and API gateway routing service.',
    features: [
      {
        id: 'feat-plat-01-1',
        epicId: 'epic-plat-01',
        code: 'FEAT-PLT-101',
        title: 'Multi-Tenant Auth & Role Engine',
        businessValue: 'Enterprise tenant isolation with SAML/OAuth2 SSO integrations.',
        priority: 'CRITICAL',
        dependencies: ['FEAT-SDK-102'],
        estimatedSprint: 'Sprint 4',
        acceptanceCriteria: [
          'Tenant isolation at database level via tenant_id column and Row Level Security (RLS).',
          'Supports custom role creation with granular scope masks.'
        ]
      }
    ]
  }
];

export const NPEP_USER_STORIES: UserStory[] = [
  {
    id: 'story-frg-01',
    featureId: 'feat-frg-02-1',
    code: 'US-FRG-201-A',
    title: 'Scaffold Business Module Domain Aggregate via Forge CLI',
    asA: 'Backend Enterprise Engineer',
    iWant: 'to run nexora module create --name inventory --pillar platform',
    soThat: 'I get a fully scaffolded DDD business module with Aggregate Roots, repository interfaces, FastAPI controllers, and Vitest test stubs compliant with EIF Step 4 & 6.',
    acceptanceCriteria: [
      'Command creates folder structure under /src/modules/inventory within 2 seconds.',
      'Generated aggregate root class contains encapsulated adjustStock method throwing InsufficientStockException on invalid input.',
      'FastAPI async router is mounted with OpenAPI 3.1 tagging.',
      'Generates 6 locale translation JSON files (en.json, fr.json, ar.json, es.json, pt.json, bm.json).'
    ],
    businessRules: [
      'Module name must be snake_case alphanumeric.',
      'Must check workspace git status to ensure clean working tree before scaffolding.',
      'Generated entity MUST use UUID v4 primary keys.'
    ],
    edgeCases: [
      'If directory already exists, abort command with non-zero exit code and display colored error message.',
      'If disk space is under 100MB, throw DiskCapacityException.'
    ],
    nfr: {
      security: 'All generated endpoints must include @require_permission OAuth2 decorator.',
      performance: 'Command execution time must complete in < 2.5 seconds.'
    },
    tasks: [
      { category: 'Backend', title: 'Implement Jinja2 aggregate template generator for Python domain entities', estimateHours: 4, assignedAiAgent: 'Codex / Cursor Backend Architect' },
      { category: 'API', title: 'Create FastAPI router generator with async endpoint signatures', estimateHours: 3, assignedAiAgent: 'Codex / Cursor Backend Architect' },
      { category: 'Frontend', title: 'Build React UI Page template generator with Tailwind & i18n hooks', estimateHours: 4, assignedAiAgent: 'Lovable / Base44 Frontend Specialist' },
      { category: 'Database', title: 'Scaffold Drizzle ORM schema script with UUID v4 PKs', estimateHours: 2, assignedAiAgent: 'Codex / Cursor Backend Architect' },
      { category: 'Localization', title: 'Generate 6-locale JSON dictionary stubs (en, fr, ar, es, pt, bm)', estimateHours: 2, assignedAiAgent: 'Gemini / Google AI Studio Architect' },
      { category: 'Tests', title: 'Create Vitest component render test and pytest unit assertions', estimateHours: 3, assignedAiAgent: 'Codex Test Engineer' },
      { category: 'DevOps', title: 'Add CLI rollback handler for partial generation failure', estimateHours: 2, assignedAiAgent: 'OpenHands Automation Specialist' }
    ]
  },
  {
    id: 'story-sdk-01',
    featureId: 'feat-sdk-01-2',
    code: 'US-SDK-102-A',
    title: 'Zero-Trust Bearer Token Validation Middleware',
    asA: 'Platform Security Officer',
    iWant: 'all incoming HTTP API requests to pass through SDK OPA Rego authorization middleware',
    soThat: 'unauthorized calls are rejected at gateway level with standard RFC 7807 error responses.',
    acceptanceCriteria: [
      'Validates RS256 signed JWT tokens against JWKS endpoint.',
      'Evaluates OPA Rego policy against request path, method, and user roles in < 2ms.',
      'Returns HTTP 401 for expired tokens and HTTP 403 for permission denied with JSON problem detail.'
    ],
    businessRules: [
      'Tokens expire after 15 minutes; refresh tokens required for renewal.',
      'Service-to-service calls must use mTLS client certificates alongside bearer token.'
    ],
    edgeCases: [
      'JWKS endpoint unreachable -> Fallback to cached public key for up to 5 minutes with warning metric.'
    ],
    nfr: {
      security: 'Zero plaintext token persistence or unmasked logging.',
      performance: 'Latency overhead added per request must be < 2ms p99.'
    },
    tasks: [
      { category: 'Backend', title: 'Implement Async PyJWT validation middleware with JWKS cache', estimateHours: 5, assignedAiAgent: 'Codex / Cursor Backend Architect' },
      { category: 'Security', title: 'Draft OPA Rego policy files for tenant and RBAC evaluation', estimateHours: 4, assignedAiAgent: 'ChatGPT Enterprise Strategist' },
      { category: 'API', title: 'Implement RFC 7807 Error Response formatter', estimateHours: 2, assignedAiAgent: 'Codex / Cursor Backend Architect' },
      { category: 'Tests', title: 'Create security unit tests for expired, forged, and valid JWTs', estimateHours: 3, assignedAiAgent: 'Codex Test Engineer' }
    ]
  }
];

export const DEVELOPMENT_ORDER_STEPS: DevelopmentOrderStep[] = [
  {
    stepNumber: 1,
    productName: 'NEXORA Forge',
    rationale: 'Forge is the developer CLI tool that scaffolds all subsequent modules, DDL migrations, FastAPI endpoints, and React UI. Building it first guarantees 100% standardized code generation for all downstream teams.',
    prerequisiteStepNumber: null,
    coreDeliverables: ['Typer CLI Engine', 'nexora doctor', 'nexora module create', 'Template Jinja2 Engine']
  },
  {
    stepNumber: 2,
    productName: 'NEXORA SDK',
    rationale: 'The SDK contains shared runtime libraries for logging, security (OPA), JWT auth, and database abstractions. All products require these core libraries to run securely.',
    prerequisiteStepNumber: 1,
    coreDeliverables: ['OTel JSON Logger', 'OPA Rego Policy Guard', 'OAuth2/JWT Validator', 'Drizzle DB Client']
  },
  {
    stepNumber: 3,
    productName: 'NEXORA Studio',
    rationale: 'Provides visual domain modeling and API contract design tools. It relies on Forge CLI under the hood to execute scaffolding commands visually.',
    prerequisiteStepNumber: 2,
    coreDeliverables: ['Visual Domain Modeler', 'API Spec Designer', 'CLI Command Visualizer']
  },
  {
    stepNumber: 4,
    productName: 'NEXORA Platform Foundation',
    rationale: 'Establishes basic multi-tenant microservice infrastructure, API gateway, and message bus (NATS/Redis) prior to deploying specific platform engines.',
    prerequisiteStepNumber: 3,
    coreDeliverables: ['Kong API Gateway Config', 'NATS Event Bus Handler', 'Multi-tenant RLS Helper']
  },
  {
    stepNumber: 5,
    productName: 'NEXORA CORE',
    rationale: 'The master IAM system handling tenant registration, user identities, permissions, and subscription lifecycle across all products.',
    prerequisiteStepNumber: 4,
    coreDeliverables: ['Tenant Registration API', 'IAM User Directory', 'Subscription Entitlement Guard']
  },
  {
    stepNumber: 6,
    productName: 'Knowledge Portal (NKP)',
    rationale: 'Central repository for domain documentation, OpenAPI catalogs, and developer onboarding. Must exist early so developers and AI agents can query live system documentation.',
    prerequisiteStepNumber: 5,
    coreDeliverables: ['Doc Search Index', 'OpenAPI Swagger Aggregator', 'Architecture ADR Viewer']
  },
  {
    stepNumber: 7,
    productName: 'Marketplace Platform',
    rationale: 'Allows internal and external developers to publish, discover, and install custom NEXORA modules and Forge templates.',
    prerequisiteStepNumber: 6,
    coreDeliverables: ['Module Package Registry', 'Template Search API', 'Module Installation Engine']
  },
  {
    stepNumber: 8,
    productName: 'Automation Engine',
    rationale: 'Workflow orchestrator executing multi-step async tasks, scheduled webhooks, and event-driven business process scripts.',
    prerequisiteStepNumber: 7,
    coreDeliverables: ['Temporal/Celery Worker Mesh', 'Workflow DAG Execution API', 'Trigger Listener']
  },
  {
    stepNumber: 9,
    productName: 'AI Platform (Gemini 2.5 Flash)',
    rationale: 'Hooks Gemini 2.5 Flash server-side proxies, pgvector RAG index pipelines, function calling, and structured output parsers for intelligent modules.',
    prerequisiteStepNumber: 8,
    coreDeliverables: ['Server-Side Gemini Proxy', 'pgvector Embedding Pipeline', 'RAG Retrieval Grounding']
  },
  {
    stepNumber: 10,
    productName: 'Analytics Engine',
    rationale: 'Collects real-time telemetry, user action logs, and KPI metric aggregations across all running micro-services.',
    prerequisiteStepNumber: 9,
    coreDeliverables: ['ClickHouse/Timescale Pipeline', 'Prometheus Metric Exporter', 'Real-time KPI Dashboard']
  },
  {
    stepNumber: 11,
    productName: 'Mining Platform',
    rationale: 'Process mining and business telemetry analysis engine that inspects execution logs to detect process bottlenecks.',
    prerequisiteStepNumber: 10,
    coreDeliverables: ['Process Log Parser', 'Petri Net Graph Constructor', 'Bottleneck Detector']
  },
  {
    stepNumber: 12,
    productName: 'SIGS Governance Engine',
    rationale: 'Strategic Governance & Compliance suite enforcing enterprise regulatory policies, audit trails, and automated security reports.',
    prerequisiteStepNumber: 11,
    coreDeliverables: ['Regulatory Compliance Reporter', 'Audit Log Immutability Guard', 'Executive SLA Dashboard']
  }
];

export const RELEASE_MILESTONES: ReleaseMilestone[] = [
  {
    version: 'Forge v0.1.0',
    productName: 'NEXORA Forge',
    targetQuarter: 'Q3 2026',
    objectives: ['Release CLI foundation with Typer, Rich formatting, and nexora doctor system diagnostic.'],
    keyFeatures: ['CLI Engine', 'Doctor Diagnostics', 'Basic File Scaffolding'],
    risks: ['OS compatibility issues on Windows/macOS/Linux.'],
    dependencies: ['Python 3.11+'],
    exitCriteria: ['100% pytest unit coverage on CLI flags', 'Zero unhandled exception crashes']
  },
  {
    version: 'Forge v0.2.0',
    productName: 'NEXORA Forge',
    targetQuarter: 'Q3 2026',
    objectives: ['Full module generation engine supporting DDD domain aggregate scaffolding and FastAPI endpoints.'],
    keyFeatures: ['nexora module create', 'FastAPI Scaffolding', 'Drizzle Schema Generator'],
    risks: ['Template syntax syntax errors in generated code.'],
    dependencies: ['Forge v0.1.0'],
    exitCriteria: ['Generated modules pass mypy --strict and tsc checks automatically']
  },
  {
    version: 'Forge v0.3.0',
    productName: 'NEXORA Forge',
    targetQuarter: 'Q4 2026',
    objectives: ['Full CRUD generator, i18n dictionary sync (6 locales), and automated doc generator.'],
    keyFeatures: ['nexora crud create', 'nexora i18n sync', 'nexora doc generate'],
    risks: ['i18n missing key warnings.'],
    dependencies: ['Forge v0.2.0'],
    exitCriteria: ['100% key match across en, fr, ar, es, pt, bm translation files']
  },
  {
    version: 'SDK v0.1.0',
    productName: 'NEXORA SDK',
    targetQuarter: 'Q3 2026',
    objectives: ['Publish foundational python and typescript NPM packages for logging, config, and security.'],
    keyFeatures: ['OTel JSON Logger', 'Rego ABAC Guard', 'Config Loader'],
    risks: ['Performance overhead on OPA evaluation.'],
    dependencies: [],
    exitCriteria: ['Sub-2ms evaluation latency SLA on security policies']
  },
  {
    version: 'CORE v1.0',
    productName: 'NEXORA Platform',
    targetQuarter: 'Q4 2026',
    objectives: ['First production-ready launch of CORE Multi-Tenant IAM service.'],
    keyFeatures: ['Multi-Tenant RLS', 'SSO OAuth2/SAML', 'Role Entitlements'],
    risks: ['Database connection pool saturation under high concurrency.'],
    dependencies: ['SDK v0.1.0', 'Forge v0.3.0'],
    exitCriteria: ['Passes 5,000 RPS k6 load test with p95 < 40ms']
  },
  {
    version: 'NKP v1.0',
    productName: 'Knowledge Portal',
    targetQuarter: 'Q4 2026',
    objectives: ['Centralized documentation and OpenAPI specification hub for enterprise developers.'],
    keyFeatures: ['Doc Search', 'OpenAPI Inspector', 'ADR Viewer'],
    risks: ['Stale documentation indexing.'],
    dependencies: ['CORE v1.0'],
    exitCriteria: ['Sub-100ms doc search query latency']
  },
  {
    version: 'Marketplace v1.0',
    productName: 'Marketplace Platform',
    targetQuarter: 'Q1 2027',
    objectives: ['Module registry for discovering and installing certified NEXORA extensions.'],
    keyFeatures: ['Package Registry', 'Extension Installer', 'Security Scanner'],
    risks: ['Malicious third-party package submission.'],
    dependencies: ['NKP v1.0'],
    exitCriteria: ['Automated Trivy security scan on all published extensions']
  },
  {
    version: 'Automation v1.0',
    productName: 'Automation Engine',
    targetQuarter: 'Q1 2027',
    objectives: ['Enterprise workflow DAG execution and scheduled background workers.'],
    keyFeatures: ['Workflow Execution', 'Webhook Listener', 'Retry Policy Engine'],
    risks: ['Stuck asynchronous workflow executions.'],
    dependencies: ['Marketplace v1.0'],
    exitCriteria: ['Zero lost messages on worker restart']
  },
  {
    version: 'AI v1.0',
    productName: 'AI Platform',
    targetQuarter: 'Q1 2027',
    objectives: ['Server-side Gemini 2.5 Flash RAG vector retrieval & structured reasoning pipelines.'],
    keyFeatures: ['Gemini 2.5 Proxy', 'pgvector RAG Search', 'Tool Sandbox'],
    risks: ['LLM rate limits during peak usage.'],
    dependencies: ['Automation v1.0'],
    exitCriteria: ['Automatic exponential backoff fallback on rate limit']
  },
  {
    version: 'Analytics v1.0',
    productName: 'Analytics Engine',
    targetQuarter: 'Q2 2027',
    objectives: ['Real-time telemetry aggregation and executive KPI dashboards.'],
    keyFeatures: ['Telemetry Aggregator', 'Grafana Dashboard Spec', 'Prometheus Alerts'],
    risks: ['High memory consumption on large time-series queries.'],
    dependencies: ['AI v1.0'],
    exitCriteria: ['Sub-200ms rendering on 30-day KPI metric queries']
  },
  {
    version: 'Mining v1.0',
    productName: 'Mining Platform',
    targetQuarter: 'Q2 2027',
    objectives: ['Process mining and workflow bottleneck detection engine.'],
    keyFeatures: ['Process Log Parser', 'Petri Net Visualizer', 'Bottleneck Alerts'],
    risks: ['Complex graph rendering performance in browser.'],
    dependencies: ['Analytics v1.0'],
    exitCriteria: ['Render 10,000 node Petri nets without frame drop (60 FPS)']
  },
  {
    version: 'SIGS v1.0',
    productName: 'SIGS Governance',
    targetQuarter: 'Q2 2027',
    objectives: ['Strategic Governance suite for automated SOC2, GDPR, and enterprise compliance reporting.'],
    keyFeatures: ['Compliance Auditor', 'Immutable Audit Log', 'Executive SLA Dashboard'],
    risks: ['Unchecked compliance data drift.'],
    dependencies: ['Mining v1.0'],
    exitCriteria: ['Generate 100% compliant SOC2 Type II automated audit report']
  }
];

export const SPRINT_DEFINITIONS: SprintDefinition[] = [
  {
    sprintNumber: 1,
    sprintGoal: 'Forge CLI Foundation & Telemetry SDK Bootstrap',
    targetProduct: 'NEXORA Forge & SDK',
    featuresIncluded: ['FEAT-FRG-101 (Typer CLI)', 'FEAT-FRG-102 (Doctor Diagnostics)', 'FEAT-SDK-101 (OTel Logger)'],
    definitionOfDone: [
      'nexora --help and nexora doctor execute cleanly with formatted output.',
      'Unit test coverage >= 85% via pytest.',
      'All code passes static typing (mypy --strict and tsc --noEmit).'
    ],
    risks: ['OS environment variable differences during doctor check.'],
    requiredAiAgents: ['Codex / Cursor Backend Architect', 'OpenHands DevOps Specialist'],
    githubMilestone: 'Sprint-01-Forge-Foundation'
  },
  {
    sprintNumber: 2,
    sprintGoal: 'Module Scaffolder Engine & Security Guard Middleware',
    targetProduct: 'NEXORA Forge & SDK',
    featuresIncluded: ['FEAT-FRG-201 (DDD Scaffolder)', 'FEAT-SDK-102 (OPA ABAC Guard)'],
    definitionOfDone: [
      'nexora module create --name inventory scaffolds clean project directory in < 2s.',
      'OPA Rego authorization middleware evaluates JWT tokens in < 2ms.',
      'Generated code includes 6 locale JSON dictionaries (en, fr, ar, es, pt, bm).'
    ],
    risks: ['Jinja2 file encoding errors on non-ASCII locale characters.'],
    requiredAiAgents: ['Codex / Cursor Backend Architect', 'Lovable / Base44 Frontend Specialist', 'ChatGPT Enterprise Strategist'],
    githubMilestone: 'Sprint-02-Module-Scaffolder'
  },
  {
    sprintNumber: 3,
    sprintGoal: 'NEXORA Studio Visual Domain & API Spec Modeler',
    targetProduct: 'NEXORA Studio',
    featuresIncluded: ['Visual Domain Modeler', 'API Contract Designer'],
    definitionOfDone: [
      'Architects can visually model domain entities and export OpenAPI 3.1 YAML.',
      'WCAG AAA color contrast verification passed.',
      'Responsive UI renders cleanly from 320px to 3840px viewports.'
    ],
    risks: ['Canvas rendering lag on large domain graphs.'],
    requiredAiAgents: ['Lovable / Base44 Frontend Specialist', 'Gemini / Google AI Studio Architect'],
    githubMilestone: 'Sprint-03-Studio-Visualizer'
  },
  {
    sprintNumber: 4,
    sprintGoal: 'NEXORA CORE IAM Multi-Tenant Service Mesh',
    targetProduct: 'NEXORA Platform',
    featuresIncluded: ['FEAT-PLT-101 (Multi-Tenant Auth)', 'Row Level Security Helpers'],
    definitionOfDone: [
      'Multi-tenant DB isolation verified via automated integration tests.',
      'OAuth2 / SAML authentication flow functioning with JWT session tokens.',
      'Kong API gateway configuration validated.'
    ],
    risks: ['Cross-tenant data leakage if RLS policy has syntax flaw.'],
    requiredAiAgents: ['Codex / Cursor Backend Architect', 'ChatGPT Security Guardian'],
    githubMilestone: 'Sprint-04-CORE-IAM'
  }
];

export const GITHUB_ROADMAP_CONFIG = {
  branchStrategy: 'GitFlow Variant (main -> release/vX.Y -> develop -> feature/US-XXX)',
  semverRule: 'MAJOR.MINOR.PATCH (Breaking changes increment MAJOR, Features increment MINOR, Fixes increment PATCH)',
  milestones: [
    'v0.1.0-Forge-Foundation',
    'v0.2.0-Module-Scaffolder',
    'v0.3.0-Forge-Complete',
    'v1.0.0-CORE-IAM-Release',
    'v1.0.0-Full-Ecosystem-GA'
  ],
  labels: [
    { name: 'pillar:forge', color: '9333ea', description: 'NEXORA Forge CLI & Scaffolding' },
    { name: 'pillar:sdk', color: '0284c7', description: 'NEXORA SDK Runtime Libraries' },
    { name: 'pillar:studio', color: 'ec4899', description: 'NEXORA Studio Visual Workbench' },
    { name: 'pillar:platform', color: '059669', description: 'NEXORA Platform Microservices' },
    { name: 'type:user-story', color: '3b82f6', description: 'Agile User Story Issue' },
    { name: 'type:quality-gate', color: 'd97706', description: 'EIF Quality Gate Violation' },
    { name: 'security:critical', color: 'dc2626', description: 'Blocking Security Audit Issue' }
  ],
  pullRequestTemplate: `## NPEP Pull Request Checklist

### 1. User Story Reference
- **User Story ID**: US-FRG-XXX
- **Target Epic**: EPIC-FRG-XX

### 2. Quality Gate Verification (EIF 20-Step Pipeline)
- [ ] Static typing check: \`mypy --strict\` & \`tsc --noEmit\` pass cleanly.
- [ ] Code Coverage: pytest / Vitest coverage >= 85%.
- [ ] Security Audit: OPA Rego policies pass; zero hardcoded secrets.
- [ ] Internationalization: 100% key match across en, fr, ar, es, pt, bm.
- [ ] Performance SLA: Latency < 50ms p95 on API endpoints.

### 3. AI Agent Sign-off
- **Assigned AI Agent**: Codex / Cursor / Lovable / OpenHands / Gemini
- **Reviewer Signature**: Passed automated lint_applet and compile_applet.`
};
